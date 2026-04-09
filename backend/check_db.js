import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MONGODB_URI:", MONGODB_URI.split("@")[1]); // mask password
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Check where the document actually went
    const payments = db.collection('payments');
    const doc = await payments.findOne({ orderId: "order_Sah6s4ZKrFQv7B" });
    if(doc) {
       console.log("Found in 'payments' collection", doc);
    } else {
       console.log("Not found in 'payments' collection");
    }

    const Payments = db.collection('Payments');
    const doc2 = await Payments.findOne({ orderId: "order_Sah6s4ZKrFQv7B" });
    if(doc2) {
       console.log("Found in 'Payments' collection", doc2);
    } else {
       console.log("Not found in 'Payments' collection");
    }

    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
