import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_DB = process.env.MONGO_DB;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected: ", mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
