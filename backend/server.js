// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import path from "path";
import blogsRouter from "./routes/blogs.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve upload folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ────────────────────────────────
// 🔗 MongoDB Connection
// ────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ────────────────────────────────
// User Schema
// ────────────────────────────────
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
});
const User = mongoose.model("User", userSchema);

// ────────────────────────────────
// Soil Schema
// ────────────────────────────────
const soilSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    suitableCrops: [String],
    phLevel: Number,
    nutrients: [String],
  },
  { timestamps: true }
);
const Soil = mongoose.model("Soil", soilSchema);

// ────────────────────────────────
// Distributor Schema
// ────────────────────────────────
const distributorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    seedType: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);
const Distributor = mongoose.model("Distributor", distributorSchema);

// ────────────────────────────────
// ROUTES
// ────────────────────────────────

// Health check
app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});

// Register route
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashed });
    await newUser.save();

    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    // Super Admin Hardcoded
    if (email === "arkhan@gmail.com" && password === "zayed") {
      return res.json({ success: true, role: "admin", email });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });

    res.json({ success: true, role: "user", email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all soils
app.get("/api/soil", async (req, res) => {
  try {
    const soils = await Soil.find();
    res.json(soils);
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add soil
app.post("/api/soil", async (req, res) => {
  try {
    const { name, description, suitableCrops, phLevel, nutrients } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Soil name is required" });

    const newSoil = new Soil({
      name,
      description,
      suitableCrops,
      phLevel,
      nutrients,
    });

    await newSoil.save();
    res.json({ success: true, soil: newSoil });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update soil by id (admin only)
app.put("/api/soil/:id", async (req, res) => {
  const role = req.headers["x-role"];
  if (role !== "admin") {
    return res.status(403).json({ success: false, message: "Only admin can update" });
  }

  try {
    const { id } = req.params;
    const { name, description, suitableCrops, phLevel, nutrients } = req.body;

    const soil = await Soil.findById(id);
    if (!soil) return res.status(404).json({ success: false, message: "Soil not found" });

    if (name) soil.name = name;
    if (description !== undefined) soil.description = description;
    if (suitableCrops !== undefined) soil.suitableCrops = Array.isArray(suitableCrops) ? suitableCrops : [];
    if (phLevel !== undefined) soil.phLevel = phLevel;
    if (nutrients !== undefined) soil.nutrients = Array.isArray(nutrients) ? nutrients : [];

    const updated = await soil.save();
    res.json({ success: true, soil: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Bulk delete soils (admin only)
app.delete("/api/soil", async (req, res) => {
  const role = req.headers["x-role"];
  if (role !== "admin") {
    return res.status(403).json({ success: false, message: "Only admin can delete" });
  }

  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "IDs required" });
    }

    const result = await Soil.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get distributors
app.get("/api/distributors", async (req, res) => {
  try {
    const distributors = await Distributor.find();
    res.json(distributors);
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add distributor
app.post("/api/distributors", async (req, res) => {
  const { name, contact, seedType, price, quantity } = req.body;

  if (!name || !contact || !seedType || price == null || quantity == null) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const newDist = new Distributor({
      name,
      contact,
      seedType,
      price,
      quantity,
    });

    await newDist.save();
    res.json({ success: true, distributor: newDist });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ────────────────────────────────
// UPDATE distributor (admin only)
// ────────────────────────────────
app.put("/api/distributors/:id", async (req, res) => {
  const role = req.headers["x-role"];
  if (role !== "admin") {
    return res.status(403).json({ success: false, message: "Only admin can update" });
  }

  try {
    const { id } = req.params;
    const dist = await Distributor.findById(id);

    if (!dist)
      return res.status(404).json({ success: false, message: "Distributor not found" });

    const { name, contact, seedType, price, quantity } = req.body;

    if (name) dist.name = name;
    if (contact) dist.contact = contact;
    if (seedType) dist.seedType = seedType;
    if (price !== undefined) dist.price = price;
    if (quantity !== undefined) dist.quantity = quantity;

    const updated = await dist.save();
    res.json({ success: true, distributor: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ────────────────────────────────
// BULK DELETE distributors (admin only)
// ────────────────────────────────
app.delete("/api/distributors", async (req, res) => {
  const role = req.headers["x-role"];
  if (role !== "admin") {
    return res.status(403).json({ success: false, message: "Only admin can delete" });
  }

  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ success: false, message: "IDs required" });

    const result = await Distributor.deleteMany({ _id: { $in: ids } });

    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ────────────────────────────────
// BLOG ROUTES
// ────────────────────────────────
app.use("/api/blogs", blogsRouter);

// ────────────────────────────────
// Start Server
// ────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
