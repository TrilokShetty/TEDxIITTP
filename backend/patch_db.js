import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    
    // Model schema definition
    const paymentSchema = new mongoose.Schema({
        orderId:   { type: String, required: true, unique: true },
        paymentId: { type: String, default: null },
        amount:         { type: Number, required: true },
        passId:         { type: String, required: true },
        passLabel:      { type: String, required: true },
        numberOfPasses: { type: Number, required: true, min: 1, max: 4 },
        name:  { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    }, { timestamps: true });

    const Payment = mongoose.model("Payment", paymentSchema);
    
    const result = await Payment.findOneAndUpdate(
      { orderId: "order_Sah6s4ZKrFQv7B" },
      {
        orderId: "order_Sah6s4ZKrFQv7B",
        paymentId: "pay_Sah7MToYglxtJq",
        passId: "premium",
        passLabel: "Premium Pass",
        numberOfPasses: 1,
        amount: 0,
        name: "Duggirala Jnana Sai Srikar",
        email: "me25b013@iittp.ac.in",
        phone: "+91 7799 046969",
        status: "paid"
      },
      { upsert: true, new: true }
    );
    
    console.log("Updated/Created document:", result);
    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
