import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products", { className: "bg-white text-hero" });
      }
    };
    fetchProducts();
  }, []);

  // Add to Cart function
  const handleAddToCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          productId,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Added to cart successfully!", { className: "bg-white text-hero" });
      } else {
        toast.error(data.error || "Failed to add to cart", { className: "bg-white text-hero" });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong. Please try again.", { className: "bg-white text-hero" });
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
