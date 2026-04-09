/**
 * server.js — TEDxIITTirupati 2026 · Simple Ticketing Backend (Razorpay)
 *
 * Flow:
 *  1. User picks pass type + number of passes (1–4)
 *  2. Backend creates Razorpay order, decrements pendingSeats, saves pending Payment
 *  3. Frontend opens Razorpay checkout
 *  4. On success: frontend calls /api/verify-payment → status set to "paid"
 *  5. On failure: seats are restored
 */

import "dotenv/config";
import express  from "express";
import cors     from "cors";
import crypto   from "crypto";
import mongoose from "mongoose";
import Razorpay from "razorpay";

import Payment   from "./models/Payment.js";
import SeatCount from "./models/SeatCount.js";
import { sendConfirmationEmail } from "./services/emailService.js";

// ── ENV ────────────────────────────────────────────────────────────────────
const {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  MONGODB_URI = "mongodb://127.0.0.1:27017/tedx_payments",
  PORT        = 5000,
  ADMIN_SECRET,
} = process.env;

// ── Initial seat counts per pass type (only used on first run) ─────────────
const INITIAL_SEATS = {
  regular: 55,
  access: 95,
  premium: 40,
};

const REQUIRED_VARS = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "ADMIN_SECRET"];
const missingVars = REQUIRED_VARS.filter((v) => !process.env[v]);
if (missingVars.length) {
  console.error("❌  Missing required env vars:", missingVars.join(", "));
  process.exit(1);
}

// ── Razorpay instance ──────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id:     RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// ── Server-side price map ──────────────────────────────────────────────────
const PASS_PRICES = {
  regular: 299,
  access: 149,
  premium: 499,
};

// ── Express setup ──────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: [
    "https://tedx.iittp.ac.in",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://10.21.24.253:5173",
  ],
  methods:     ["GET", "POST", "PUT", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

// ═══════════════════════════════════════════════════════════════════════════
//  POST /api/create-order
//
//  Creates a Razorpay order, decrements seats, saves a pending Payment.
// ═══════════════════════════════════════════════════════════════════════════
app.post("/api/create-order", async (req, res) => {
  try {
    const { passId, passLabel, name, email, phone, numberOfPasses } = req.body;

    // ── Validate ────────────────────────────────────────────────────────
    if (!passId || !passLabel || !name?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!PASS_PRICES[passId]) {
      return res.status(400).json({ error: "Invalid pass type." });
    }

    const passes = parseInt(numberOfPasses, 10);
    if (!passes || passes < 1 || passes > 4) {
      return res.status(400).json({ error: "Number of passes must be between 1 and 4." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (!/^\d{10}$/.test(phone.replace(/[\s\-()]/g, ""))) {
      return res.status(400).json({ error: "Please enter a valid 10-digit phone number." });
    }

    const cleanName  = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    const amount     = PASS_PRICES[passId] * passes; // total in INR

    // ── Check seat availability (do not block/reserve seats yet) ─────────
    const seatDoc = await SeatCount.findOne({ _id: passId, pendingSeats: { $gte: passes } });

    if (!seatDoc) {
      return res.status(410).json({ error: `Sorry, not enough ${passLabel} seats available.` });
    }

    // ── Create Razorpay order + save Payment ───────────────────────────
    // If either fails, restore the decremented seats.
    let order;
    try {
      order = await razorpay.orders.create({
        amount:   amount * 100, // Razorpay expects paise
        currency: "INR",
        receipt:  `tedx_${Date.now()}`,
        notes: {
          name:  cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          passId,
          passLabel,
          numberOfPasses: String(passes),
        },
      });

      await Payment.create({
        orderId:        order.id,
        amount,
        passId,
        passLabel,
        numberOfPasses: passes,
        name:           cleanName,
        email:          cleanEmail,
        phone:          cleanPhone,
        status:         "pending",
      });
    } catch (innerErr) {
      console.error("create-order error:", innerErr);
      return res.status(500).json({ error: "Something went wrong. Please try again." });
    }

    return res.json({
      orderId:   order.id,
      amount:    amount * 100, // paise for frontend
      currency:  "INR",
      keyId:     RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  POST /api/verify-payment
//
//  Called by frontend after Razorpay checkout succeeds.
//  Verifies the signature, updates Payment status to "paid".
// ═══════════════════════════════════════════════════════════════════════════
app.post("/api/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details." });
    }

    // ── Verify signature ───────────────────────────────────────────────
    const expectedSig = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed." });
    }

    // ── Update payment record ──────────────────────────────────────────
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id, status: "pending" },
      { status: "paid", paymentId: razorpay_payment_id },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found or already verified." });
    }

    // ── Deduct seats now that payment is confirmed ─────────────────────
    await SeatCount.findOneAndUpdate(
      { _id: payment.passId },
      { $inc: { pendingSeats: -payment.numberOfPasses } }
    );

    console.log(`✅  Payment verified: ${razorpay_payment_id} — ${payment.numberOfPasses} pass(es) for "${payment.name}"`);

    // ── Send Confirmation Email ────────────────────────────────────────
    try {
      await sendConfirmationEmail(payment);
    } catch (emailErr) {
      console.error("⚠️ Email sending failed, but booking was successful:", emailErr.message);
    }

    return res.json({
      success: true,
      paymentId: razorpay_payment_id,
      passLabel: payment.passLabel,
      numberOfPasses: payment.numberOfPasses,
    });

  } catch (err) {
    console.error("verify-payment error:", err);
    return res.status(500).json({ error: "Verification failed. Please contact support." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  POST /api/payment-failed
//
//  Called by frontend when Razorpay payment fails/is dismissed.
//  Restores seats and marks record as failed.
// ═══════════════════════════════════════════════════════════════════════════
app.post("/api/payment-failed", async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId." });
    }

    const payment = await Payment.findOneAndUpdate(
      { orderId, status: "pending" },
      { status: "failed" },
      { new: true }
    );

    if (payment) {
      console.log(`❌  Payment failed or cancelled for "${payment.name}"`);
    }

    return res.json({ success: true });

  } catch (err) {
    console.error("payment-failed error:", err);
    return res.status(500).json({ error: "Internal error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  POST /api/admin/resend-email
//  Retriggers the confirmation email for a given payment
// ═══════════════════════════════════════════════════════════════════════════
app.post("/api/admin/resend-email", async (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: "Missing paymentId." });

    const payment = await Payment.findOne({ paymentId, status: "paid" });
    if (!payment) return res.status(404).json({ error: "Paid record not found." });

    await sendConfirmationEmail(payment);
    console.log(`✉️  Retriggered email for ${payment.email} (${paymentId})`);
    
    return res.json({ success: true });
  } catch (err) {
    console.error("resend-email error:", err);
    return res.status(500).json({ error: "Internal error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  GET /api/admin/paid-tickets
//  Returns list of all paid tickets and a summary of passes sold.
//  Publicly accessible via a secret link.
// ═══════════════════════════════════════════════════════════════════════════
app.get("/api/admin/paid-tickets", async (req, res) => {
  try {
    const paidPayments = await Payment.find({ status: "paid" }).sort({ createdAt: -1 });

    const summary = {
      totalPassesSold: 0,
      totalRevenue: 0,
      byPassType: {}
    };

    const tickets = paidPayments.map((t) => {
      summary.totalPassesSold += t.numberOfPasses;
      summary.totalRevenue += t.amount;
      
      if (!summary.byPassType[t.passId]) {
        summary.byPassType[t.passId] = {
          label: t.passLabel,
          passesSold: 0,
          revenue: 0,
        };
      }
      summary.byPassType[t.passId].passesSold += t.numberOfPasses;
      summary.byPassType[t.passId].revenue += t.amount;

      return {
        name: t.name,
        email: t.email,
        phone: t.phone,
        numberOfPasses: t.numberOfPasses,
        paymentId: t.paymentId,
        passId: t.passId,
        passLabel: t.passLabel,
        amount: t.amount,
        createdAt: t.createdAt,
      };
    });

    return res.json({ summary, tickets });
  } catch (err) {
    console.error("paid-tickets fetch error:", err);
    return res.status(500).json({ error: "Internal error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  GET /api/seats — public, returns available seats per pass type
// ═══════════════════════════════════════════════════════════════════════════
app.get("/api/seats", async (_req, res) => {
  try {
    const docs = await SeatCount.find({});
    const result = {};
    for (const doc of docs) {
      result[doc._id] = doc.pendingSeats;
    }
    return res.json(result);
  } catch (err) {
    console.error("seats fetch error:", err);
    return res.status(500).json({ error: "Internal error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  PUT /api/admin/seats — update seat count for a specific pass type
//  Body: { adminSecret, passId, pendingSeats }
//  Example: { adminSecret: "xxx", passId: "premium", pendingSeats: 60 }
// ═══════════════════════════════════════════════════════════════════════════
app.put("/api/admin/seats", async (req, res) => {
  try {
    const { adminSecret, passId, pendingSeats } = req.body;

    if (adminSecret !== ADMIN_SECRET) {
      return res.status(403).json({ error: "Forbidden." });
    }

    if (!passId || !PASS_PRICES[passId]) {
      return res.status(400).json({ error: "Invalid passId. Use 'regular', 'access', or 'premium'." });
    }

    const newCount = parseInt(pendingSeats, 10);
    if (isNaN(newCount) || newCount < 0) {
      return res.status(400).json({ error: "pendingSeats must be a non-negative integer." });
    }

    const updated = await SeatCount.findOneAndUpdate(
      { _id: passId },
      { pendingSeats: newCount },
      { new: true }
    );

    console.log(`🔧  Admin: ${passId} pendingSeats updated to ${newCount}`);
    return res.json({ passId, pendingSeats: updated.pendingSeats });

  } catch (err) {
    console.error("Admin seats update error:", err);
    return res.status(500).json({ error: "Internal error." });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
//  STARTUP
// ═══════════════════════════════════════════════════════════════════════════
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("✅  MongoDB connected");

    // Seed initial seat counts per pass type (only if not already set)
    for (const [passId, seats] of Object.entries(INITIAL_SEATS)) {
      await SeatCount.findOneAndUpdate(
        { _id: passId },
        { $setOnInsert: { pendingSeats: seats } },
        { upsert: true }
      );
    }
    console.log("✅  Seat counts seeded (existing values preserved)");

    app.listen(PORT, () => {
      console.log(`🚀  Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  });