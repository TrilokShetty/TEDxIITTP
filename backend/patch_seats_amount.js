import "dotenv/config";
import mongoose from "mongoose";
import SeatCount from "./models/SeatCount.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tedx_payments";

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB for patching seats.");
    await SeatCount.findOneAndUpdate(
      { _id: "regular" },
      { pendingSeats: 57 },
      { upsert: true }
    );
    await SeatCount.findOneAndUpdate(
      { _id: "access" },
      { pendingSeats: 75},
      { upsert: true }
    );
    console.log("Seats successfully patched to regular: 55, access: 95");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
