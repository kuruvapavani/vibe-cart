import React, { useEffect, useState } from "react";
import CartCard from "../components/CartCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCartItems();
  }, []);

  // Fetch all cart items for logged-in user
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/cart/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Cart response:", response.data);
      setCartItems(response.data.items || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

const onUpdateQty = async (cartItemId, newQty) => {
  if (newQty < 1) return;
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/cart/${user.id}`,
      { cartItemId, qty: newQty },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? { ...item, qty: res.data.qty, subtotal: res.data.subtotal }
          : item
      )
    );

    setTotal((prev) =>
      cartItems.reduce((acc, it) => acc + (it.price * it.qty), 0)
    );
  } catch (err) {
    console.error("Error updating quantity:", err);
  }
};



  // Remove item from cart (by cart _id)
  const handleRemove = async (cartItemId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/cart/${user.id}/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setCartItems((prev) => {
        const updated = prev.filter((item) => item.id !== cartItemId);
        const updatedTotal = updated.reduce(
          (acc, it) => acc + (it.subtotal || it.price * (it.qty || 1)),
          0
        );
        setTotal(updatedTotal);
        return updated;
      });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // UI Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading cart...
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white text-center">
        <h2 className="text-2xl font-semibold text-hero">Your cart is empty</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-hero rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Main Cart UI
  return (
    <div className="min-h-screen text-white px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-hero">Your Cart</h1>

      <div className="w-full max-w-3xl space-y-4">
        {cartItems.map((item) => (
          <CartCard key={item.id} item={item} onRemove={handleRemove} onUpdateQty={onUpdateQty} />
        ))}
      </div>

      <div className="mt-6 w-full max-w-3xl flex flex-col sm:flex-row justify-between items-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
        <p className="text-lg font-semibold">Total: ₹{total}</p>
        <button
          onClick={() => navigate("/checkout")}
          className="mt-3 sm:mt-0 px-6 py-2 bg-hero rounded-lg text-white"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
