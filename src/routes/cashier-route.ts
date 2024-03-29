import express from "express";
import { getCashier, postCashier } from "../controllers/cashier-controller.js";

const router = express.Router();

router.get("/", getCashier);
router.post("/", postCashier);

export default router;
