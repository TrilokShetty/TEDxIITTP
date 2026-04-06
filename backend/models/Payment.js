import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // Instamojo's payment request ID (replaces Razorpay orderId)
    paymentRequestId: { type: String, required: true, unique: true },

    // Filled in by the webhook once the payment is attempted
    paymentId: { type: String, default: null },

    amount: { type: Number, required: true },   // in INR
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