import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // ✅ import Sonner

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
      toast.error("Please login to proceed.", {
        className: "bg-white text-hero",
      });
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
        toast.success("Order placed successfully!", {
          className: "bg-white text-hero",
        });
        localStorage.removeItem("cart");
        navigate("/");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(
        err.response?.data?.message || "Checkout failed, please try again.",
        {
          className: "bg-white text-hero",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-hero">
          Checkout
        </h2>

        <div className="space-y-3">
          {["name", "street", "city", "state", "postalCode", "phone"].map(
            (field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={address[field]}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-transparent border border-white/20"
              />
            )
          )}
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
