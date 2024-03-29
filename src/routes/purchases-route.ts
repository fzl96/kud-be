import express from "express";
import {
  getPurchases,
  getPurchase,
  createPurchase,
  updatePurchase,
  deletePurchases,
  deletePurchase,
} from "../controllers/purchases-controller.js";

const router = express.Router();

router.get("/", getPurchases);
router.get("/:id", getPurchase);
router.post("/", createPurchase);
router.put("/:id", updatePurchase);
router.delete("/", deletePurchases);
router.delete("/:id", deletePurchase);

export default router;
