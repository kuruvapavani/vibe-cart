import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/products`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add to cart (placeholder)
  const handleAddToCart = async (productId) => {
    console.log("Added to cart:", productId);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-hero text-lg font-semibold">Loading products...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-16 lg:px-24">
      <h1 className="text-3xl font-bold text-hero text-center mb-8">
        Our Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
