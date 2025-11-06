import express from "express";
import { getCartItems, addToCart, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/:userId", getCartItems);
router.post("/", addToCart);
router.delete("/:userId/:id", removeFromCart);

export default router;
