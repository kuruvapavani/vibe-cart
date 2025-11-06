import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!user?.id || !token) {
      alert("Please login to proceed.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/checkout`,
        {
          userId: user.id,
          name: user.name,
          email: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        navigate("/");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.response?.data?.message || "Checkout failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-hero">Checkout</h2>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={address.name}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-transparent border border-white/20"
          />
          <input
            type="text"
            name="street"
            placeholder="Street Address"
            value={address.street}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-transparent border border-white/20"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-transparent border border-white/20"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-transparent border border-white/20"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-transparent border border-white/20"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-transparent border border-white/20"
          />
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 w-full bg-hero text-white py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
