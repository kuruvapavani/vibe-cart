// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-hero text-white shadow-md">
      <h1
        className="text-2xl font-itim font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Nexora
      </h1>

      <div className="flex items-center gap-4">
        {user && (
          <button
            onClick={() => navigate("/cart")}
            className="relative hover:scale-110 transition-transform"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
          </button>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            className="text-sm bg-white text-hero px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-sm bg-white text-hero px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
