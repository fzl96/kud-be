import express from "express";
import {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
} from "../controllers/sales.controller";

const router = express.Router();

router.get("/", getSales);
router.get("/:id", getSale);
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

export default router;
