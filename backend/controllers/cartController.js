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
        image: item.productId.image,
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

export const updateCartQty = async (req, res) => {
  const { userId } = req.params;
  const { cartItemId, qty } = req.body;

  try {
    const cartItem = await Cart.findOne({ _id: cartItemId, userId });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Prevent negative quantities
    cartItem.qty = Math.max(1, qty);
    await cartItem.save();

    const product = await Product.findById(cartItem.productId);
    const subtotal = product.price * cartItem.qty;

    res.json({
      message: "Quantity updated successfully",
      id: cartItem._id,
      qty: cartItem.qty,
      subtotal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart quantity" });
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
