import mongoose from "mongoose";

const distributorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    seedType: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    location: String,
    crops: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Distributor", distributorSchema);
