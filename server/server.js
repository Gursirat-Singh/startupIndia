import express from "express";
 import mongoose from "mongoose";
 import cors from "cors";
 import dotenv from "dotenv";

import startupRoutes from "./routes/startupRoutes.js";

dotenv.config();
console.log("Loaded MONGO_URL:", process.env.MONGO_URL);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Connection Error:", err));

app.get("/", (req, res) => res.send("API is working ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.use("/api/startups",startupRoutes);