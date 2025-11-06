import express from "express";
import { getCartItems, addToCart, removeFromCart,updateCartQty } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId",protect, getCartItems);
router.post("/",protect, addToCart);
router.put("/:userId", protect, updateCartQty);
router.delete("/:userId/:id",protect, removeFromCart);

export default router;
