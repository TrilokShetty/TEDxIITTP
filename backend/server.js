import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import mongoose from "mongoose";
import Payment from "./models/Payment.js";

// ── ENV ──────────────────────────────────────────────────────────────────────
const {
  INSTAMOJO_API_KEY,
  INSTAMOJO_AUTH_TOKEN,
  INSTAMOJO_SALT,                          // used to verify webhook MAC
  INSTAMOJO_BASE_URL = "https://www.instamojo.com/api/1.1",
  APP_BASE_URL,                            // e.g. https://tedx.iittp.ac.in
  MONGODB_URI = "mongodb://127.0.0.1:27017/tedx_payments",
  PORT = 5000,
} = process.env;

if (!INSTAMOJO_API_KEY || !INSTAMOJO_AUTH_TOKEN || !INSTAMOJO_SALT || !APP_BASE_URL) {
  console.error(
    "❌  Missing one or more required env vars: " +
    "INSTAMOJO_API_KEY, INSTAMOJO_AUTH_TOKEN, INSTAMOJO_SALT, APP_BASE_URL"
  );
  process.exit(1);
}

// ── INSTAMOJO HEADERS ────────────────────────────────────────────────────────
const instamojoHeaders = {
  "X-Api-Key": INSTAMOJO_API_KEY,
  "X-Auth-Token": INSTAMOJO_AUTH_TOKEN,
  "Content-Type": "application/x-www-form-urlencoded",
};

// ── EXPRESS ──────────────────────────────────────────────────────────────────
const app = express();
app.use(cors({
  origin: [
    "https://tedx.iittp.ac.in",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://10.21.24.253:5173",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());
// Needed to parse Instamojo webhook POST bodies (sent as form-encoded)
app.use(express.urlencoded({ extended: true }));

// ── SERVER-SIDE PRICE MAP (prevents amount tampering) ────────────────────────
const PASS_PRICES = {
  regular: 10,
  premium: 549,
};

// ── ROUTES ───────────────────────────────────────────────────────────────────

/**
 * POST /api/create-payment-link
 * Body: { passId, passLabel, name, email, phone }
 * Returns: { paymentUrl }
 *
 * Replaces the old /api/create-order + Razorpay order flow.
 * Calls the Instamojo Payment Requests API and returns the hosted checkout URL.
 */
app.post("/api/create-payment-link", async (req, res) => {
  try {
    const { passId, passLabel, name, email, phone } = req.body;

    if (!passId || !passLabel || !name || !email || !phone) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const amount = PASS_PRICES[passId];
    if (!amount) {
      return res.status(400).json({ error: "Invalid pass type." });
    }

    // Build form body for Instamojo
    const params = new URLSearchParams({
      purpose: `TEDxIITTirupati 2026 — ${passLabel}`,
      amount: String(amount),
      buyer_name: name,
      email,
      phone,
      redirect_url: `${APP_BASE_URL}/ticket-confirmed`,   // fallback redirect
      webhook: `${APP_BASE_URL}/api/instamojo-webhook`,   // async confirmation
      send_email: "true",
      send_sms: "true",
      allow_repeated_payments: "false",
    });

    const imRes = await fetch(`${INSTAMOJO_BASE_URL}/payment-requests/`, {
      method: "POST",
      headers: instamojoHeaders,
      body: params,
    });

    const imData = await imRes.json();

    if (!imRes.ok || !imData.success) {
      console.error("Instamojo create error:", imData);
      return res.status(502).json({ error: "Failed to create payment link." });
    }

    const { id: paymentRequestId, longurl: paymentUrl } = imData.payment_request;

    // Persist a pending record keyed on the Instamojo payment request ID
    await Payment.create({
      paymentRequestId,
      amount,
      passId,
      passLabel,
      name,
      email,
      phone,
      status: "pending",
    });

    return res.json({ paymentUrl });
  } catch (err) {
    console.error("create-payment-link error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * POST /api/instamojo-webhook
 * Instamojo POSTs here after every payment attempt (success or failure).
 * Verifies the MAC before updating the DB.
 *
 * Instamojo MAC algorithm:
 *   HMAC-SHA1(SALT, "payment_id|status|payment_request_id")  →  compare with `mac`
 */
app.post("/api/instamojo-webhook", async (req, res) => {
  try {
    const {
      payment_id,
      payment_request_id,
      status,        // "Credit" = success, anything else = failure
      mac,
    } = req.body;

    if (!payment_id || !payment_request_id || !status || !mac) {
      return res.status(400).send("Missing webhook fields.");
    }

    // ── MAC verification ─────────────────────────────────────────────────────
    const message = `${payment_id}|${status}|${payment_request_id}`;
    const expectedMac = crypto
      .createHmac("sha1", INSTAMOJO_SALT)
      .update(message)
      .digest("hex");

    if (expectedMac !== mac) {
      console.warn("⚠️  Instamojo webhook MAC mismatch — possible spoofing attempt");
      return res.status(400).send("MAC verification failed.");
    }

    // ── Update payment record ─────────────────────────────────────────────────
    const isPaid = status === "Credit";
    await Payment.findOneAndUpdate(
      { paymentRequestId: payment_request_id },
      {
        paymentId: payment_id,
        status: isPaid ? "paid" : "failed",
      }
    );

    console.log(`✅  Webhook: ${payment_id} → ${isPaid ? "paid" : "failed"}`);
    return res.status(200).send("OK");
  } catch (err) {
    console.error("webhook error:", err);
    return res.status(500).send("Internal server error.");
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