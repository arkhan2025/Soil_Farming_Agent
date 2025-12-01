import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import soilRoutes from "./routes/soilRoutes.js";
import distributorRoutes from "./routes/distributorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/soils", soilRoutes);
app.use("/api/distributors", distributorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🌾 Soil Farming Agent Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
