import Soil from "../models/Soil.js";
import { logAction } from "../utils/logger.js";

// GET /api/soil
export const getSoils = async (req, res) => {
  try {
    const soils = await Soil.find();
    logAction("Fetched all soils");
    res.json(soils);
  } catch (err) {
    logAction(`Error fetching soils: ${err.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/soil
export const addSoil = async (req, res) => {
  try {
    const { name, description, suitableCrops, phLevel, nutrients } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Soil name is required" });
    }

    const soil = new Soil({
      name,
      description: description || null,
      suitableCrops: Array.isArray(suitableCrops) ? suitableCrops : [],
      phLevel: phLevel === null || phLevel === "" ? null : phLevel,
      nutrients: Array.isArray(nutrients) ? nutrients : [],
    });

    const saved = await soil.save();
    logAction(`Added soil: ${saved._id}`);
    res.status(201).json({ success: true, soil: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/soil/:id
export const updateSoil = async (req, res) => {
  try {
    const role = req.headers["x-role"];
    if (role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admin can update" });
    }

    const { id } = req.params;
    const { name, description, suitableCrops, phLevel, nutrients } = req.body;

    const soil = await Soil.findById(id);
    if (!soil)
      return res
        .status(404)
        .json({ success: false, message: "Soil not found" });

    if (name) soil.name = name;
    if (description !== undefined) soil.description = description;
    if (suitableCrops !== undefined)
      soil.suitableCrops = Array.isArray(suitableCrops) ? suitableCrops : [];
    if (phLevel !== undefined) soil.phLevel = phLevel;
    if (nutrients !== undefined)
      soil.nutrients = Array.isArray(nutrients) ? nutrients : [];

    const updated = await soil.save();
    logAction(`Soil ${id} updated`);
    res.json({ success: true, soil: updated });
  } catch (err) {
    console.error("PUT /soil/:id error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/soil (bulk delete)
export const deleteSoils = async (req, res) => {
  try {
    const role = req.headers["x-role"];
    if (role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admin can delete" });
    }

    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "IDs required" });
    }

    const result = await Soil.deleteMany({ _id: { $in: ids } });
    logAction(`Deleted soils: ${ids.join(", ")}`);
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error("DELETE /soil error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
