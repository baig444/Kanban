import express from "express";
import {
  addCar,
//   getCarById,
  getCars,
} from "../controllers/car.controller.js";

const router = express.Router();

console.log("🚗 CAR ROUTES LOADED");
router.get("/", getCars);
// router.get("/:id", getCarById);
router.post("/", addCar);
router.get("/ping", (req, res) => {
  res.send("pong");
});

export default router;
