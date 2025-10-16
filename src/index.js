import express from "express";
import dontenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/bookroutes.js";
import cors from "cors";
const app = express();

dontenv.config();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.use("/api/books", bookRouter);

connectDB().then(
  app.listen(process.env.PORT, () => {
    console.log("Server is running on PORT: 3000");
  })
);
