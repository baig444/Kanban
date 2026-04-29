import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/add", addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

export default router;
