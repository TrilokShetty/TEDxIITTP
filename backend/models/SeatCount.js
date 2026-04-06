import mongoose from "mongoose";

/**
 * Per-pass-type seat counter.
 * _id is the passId ("regular" or "premium").
 * pendingSeats can be adjusted via the admin endpoint.
 */
const seatCountSchema = new mongoose.Schema(
  {
    _id:          { type: String },           // "regular" | "premium"
    pendingSeats: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("SeatCount", seatCountSchema);
