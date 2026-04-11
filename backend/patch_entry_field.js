/**
 * patch_entry_field.js — One-time migration
 * Adds `entry: false` to all existing payment documents that don't have the field.
 *
 * Usage:  node patch_entry_field.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import Payment from "./models/Payment.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tedx_payments";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connected to MongoDB");

  const result = await Payment.updateMany(
    { entry: { $exists: false } },
    { $set: { entry: false } }
  );

  console.log(`✅  Patched ${result.modifiedCount} document(s) — added entry: false`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("❌  Migration failed:", err);
  process.exit(1);
});
