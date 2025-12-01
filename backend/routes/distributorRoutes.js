import express from "express";
import { getDistributors, addDistributor } from "../controllers/distributorController.js";

const router = express.Router();

router.get("/", getDistributors);
router.post("/", addDistributor);

export default router;
