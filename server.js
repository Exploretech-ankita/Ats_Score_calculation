import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ATS")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => {
        console.log(err);
    });

app.use("/api/auth", authRoutes);
app.use("/api", resumeRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});