import express from "express";
import { getSoils, addSoil, updateSoil, deleteSoils } from "../controllers/soilController.js";

const router = express.Router();

router.get("/", getSoils);
router.post("/", addSoil);
router.put("/:id", updateSoil);      
router.delete("/", deleteSoils);      

export default router;
