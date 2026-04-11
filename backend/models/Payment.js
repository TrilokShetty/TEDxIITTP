import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // Razorpay fields
    orderId:   { type: String, required: true, unique: true },
    paymentId: { type: String, default: null },

    // Pass details
    amount:         { type: Number, required: true },
    passId:         { type: String, required: true },
    passLabel:      { type: String, required: true },
    numberOfPasses: { type: Number, required: true, min: 1, max: 4 },

    // Buyer details
    name:  { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    // Status
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // Entry tracking
    entry: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for quick lookups
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });

export default mongoose.model("Payment", paymentSchema);