import express from "express";
import multer from "multer";
import path from "path";
import Blog from "../models/Blog.js";

const router = express.Router();

// Multer storage to ./uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ok = allowed.test(file.mimetype);
    cb(null, ok);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// GET /api/blogs?q=search&sort=asc|desc
router.get("/", async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.toLowerCase() : null;
    const sort = req.query.sort === "asc" ? 1 : -1; // default desc

    const filter = q
      ? { title: { $regex: q, $options: "i" } }
      : {};

    const blogs = await Blog.find(filter).sort({ createdAt: sort }).lean();
    res.json({ success: true, blogs });
  } catch (err) {
    console.error("GET /blogs error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/blogs (multipart form-data, images)
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { title, description, authorEmail } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title required" });

    const images = (req.files || []).map((f) => `/${f.path.replace(/\\/g, "/")}`);

    const blog = new Blog({
      title,
      description,
      images,
      authorEmail,
    });

    const saved = await blog.save();
    res.status(201).json({ success: true, blog: saved });
  } catch (err) {
    console.error("POST /blogs error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/blogs/:id (update blog)
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { title, description, authorEmail } = req.body;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    // Authorization: admin or owner
    const role = req.headers["x-role"];
    if (role !== "admin" && blog.authorEmail !== authorEmail) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    blog.title = title;
    blog.description = description;

    // If new images uploaded, replace old images
    if (req.files && req.files.length > 0) {
      blog.images = req.files.map((f) => `/${f.path.replace(/\\/g, "/")}`);
    }

    await blog.save();
    res.json({ success: true, message: "Blog updated", blog });
  } catch (err) {
    console.error("PUT /blogs/:id error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE /api/blogs/:id
router.delete("/:id", async (req, res) => {
  try {
    const role = req.headers["x-role"];
    if (role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can delete" });
    }

    const doc = await Blog.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("DELETE /blogs error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
