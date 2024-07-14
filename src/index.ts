import express from "express";
import dotenv from "dotenv";
import referralRouter from "./routes/referral";
dotenv.config();
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.VITE_APP_FE_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/v1", referralRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
