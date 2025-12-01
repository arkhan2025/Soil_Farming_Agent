import Distributor from "../models/Distributor.js";
import { logAction } from "../utils/logger.js";

// GET all distributors
export const getDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.find();
    logAction("Fetched all distributors");
    res.json(distributors);
  } catch (err) {
    logAction(`Error fetching distributors: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

// POST add new distributor
export const addDistributor = async (req, res) => {
  try {
    const { name, contact, seedType, price, quantity } = req.body;

    // Validate required fields
    if (!name || !contact || !seedType || !price || !quantity) {
      return res
        .status(400)
        .json({ message: "Missing required fields (name, contact, seedType, price, quantity)" });
    }

    const distributor = new Distributor({
      name,
      contact,
      seedType,
      price,
      quantity,
    });

    const saved = await distributor.save();
    logAction(`Added new distributor: ${saved.name}`);

    res.status(201).json({
      success: true,
      message: "Distributor added successfully",
      distributor: saved,
    });
  } catch (err) {
    logAction(`Error adding distributor: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};
