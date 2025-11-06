import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// GET /api/cart/:userId
export const getCartItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await Cart.find({ userId }).populate("productId");
    let total = 0;
    const items = cartItems.map(item => {
      const subtotal = item.qty * item.productId.price;
      total += subtotal;
      return {
        id: item._id,
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        qty: item.qty,
        subtotal,
      };
    });
    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

// POST /api/cart
export const addToCart = async (req, res) => {
  const { userId, productId, qty } = req.body;
  try {
    const existingItem = await Cart.findOne({ userId, productId });
    if (existingItem) {
      existingItem.qty += qty;
      await existingItem.save();
      return res.json(existingItem);
    }

    const cartItem = await Cart.create({ userId, productId, qty });
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// DELETE /api/cart/:userId/:id
export const removeFromCart = async (req, res) => {
  const { userId, id } = req.params;
  try {
    await Cart.deleteOne({ _id: id, userId });
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};
