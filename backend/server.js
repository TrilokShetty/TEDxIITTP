import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import Payment from "./models/Payment.js";

// ── ENV ──────────────────────────────────────────────────────────────────────
const {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  MONGODB_URI = "mongodb://127.0.0.1:27017/tedx_payments",
  PORT = 5000,
} = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("❌  Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in .env");
  process.exit(1);
}

// ── RAZORPAY INSTANCE ────────────────────────────────────────────────────────
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// ── EXPRESS ──────────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// ── SERVER-SIDE PRICE MAP (prevents amount tampering) ────────────────────────
const PASS_PRICES = {
  regular: 399,
  premium: 599,
};

// ── ROUTES ───────────────────────────────────────────────────────────────────

/**
 * POST /api/create-order
 * Body: { amount, passId, passLabel, name, email, phone }
 * Returns: { orderId, amount, currency, keyId }
 */
app.post("/api/create-order", async (req, res) => {
  try {
    const { passId, passLabel, name, email, phone } = req.body;

    // Basic validation
    if (!passId || !passLabel || !name || !email || !phone) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Server-side price lookup (ignore client-sent amount)
    const amount = PASS_PRICES[passId];
    if (!amount) {
      return res.status(400).json({ error: "Invalid pass type." });
    }

    // Create Razorpay order (amount in paise)
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `tedx_${passId}_${Date.now()}`,
      notes: { passId, passLabel, name, email, phone },
    });

    // Persist pending payment
    await Payment.create({
      orderId: order.id,
      amount,
      passId,
      passLabel,
      name,
      email,
      phone,
      status: "pending",
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ error: "Failed to create order." });
  }
});

/**
 * POST /api/verify-payment
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Returns: { verified: true/false }
 */
app.post("/api/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details." });
    }

    // HMAC SHA256 verification
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    // Update payment record
    await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: isValid ? "paid" : "failed",
      }
    );

    if (!isValid) {
      return res.status(400).json({ verified: false, error: "Invalid signature." });
    }

    return res.json({ verified: true });
  } catch (err) {
    console.error("verify-payment error:", err);
    return res.status(500).json({ error: "Verification failed." });
  }
});

// ── START ────────────────────────────────────────────────────────────────────
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅  MongoDB connected");
    app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌  MongoDB connection error:", err.message);
    process.exit(1);
  });
