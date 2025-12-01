import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    images: [String], // paths to uploaded images, relative to server root like "/uploads/..."
    authorEmail: String,
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
