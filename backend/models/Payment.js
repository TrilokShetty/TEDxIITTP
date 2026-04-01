import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String, default: null },
    signature: { type: String, default: null },
    amount: { type: Number, required: true },          // in INR (not paise)
    passId: { type: String, required: true },
    passLabel: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
