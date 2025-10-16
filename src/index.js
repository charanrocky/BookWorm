import express from "express";
import dontenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/bookroutes.js";
import cors from "cors";
import job from "./config/cron.js";

if (process.env.NODE_ENV === "production") job.start();
const app = express();

dontenv.config();
app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.send("Its'Working");
});

app.use("/api/auth", authRouter);

app.use("/api/books", bookRouter);

connectDB().then(
  app.listen(process.env.PORT, () => {
    console.log("Server is running on PORT: 3000");
  })
);
