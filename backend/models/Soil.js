import mongoose from "mongoose";

const soilSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  suitableCrops: [String],
  phLevel: Number,
  nutrients: [String],
}, { timestamps: true });

export default mongoose.model("Soil", soilSchema);
