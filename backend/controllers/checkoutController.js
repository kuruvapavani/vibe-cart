import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// POST /api/checkout
export const checkout = async (req, res) => {
  const { userId, name, email } = req.body;
  try {
    const cartItems = await Cart.find({ userId }).populate("productId");
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    let total = 0;
    const items = cartItems.map((item) => {
      const subtotal = item.qty * item.productId.price;
      total += subtotal;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        qty: item.qty,
        subtotal,
      };
    });

    const receipt = {
      customer: { id: userId, name, email },
      items,
      total,
      timestamp: new Date(),
      message: "Thank you for shopping at Vibe Commerce! (Mock receipt)",
    };

    await Cart.deleteMany({ userId });

    res.json(receipt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
};
