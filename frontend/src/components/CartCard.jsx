import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";

const CartCard = ({ item, onRemove, onUpdateQty }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-md mb-4 text-white w-full max-w-3xl mx-auto border border-white/20 transition-transform hover:scale-[1.02] hover:shadow-lg duration-200">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl mb-3 sm:mb-0">
        <img
          src={item.image || "https://via.placeholder.com/150"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 sm:ml-4 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-blue-500">{item.name}</h3>
        <p className="text-sm text-blue-400 mt-1">Price: ₹{item.price}</p>
        <p className="text-blue-400 font-semibold mt-1">
          Subtotal: ₹{item.subtotal}
        </p>
      </div>

      {/* Quantity + Remove */}
      <div className="flex flex-col items-center sm:items-end mt-3 sm:mt-0 gap-3">
        {/* Quantity Controls */}
        <div className="flex items-center bg-white/10 rounded-lg px-3 py-1 border border-white/20">
          <button
            onClick={() => onUpdateQty(item.id, item.qty - 1)}
            disabled={item.qty <= 1}
            className="p-1 hover:bg-blue-500/30 bg-hero font-bold rounded-md transition disabled:opacity-50"
          >
            <Minus size={16} />
          </button>
          <span className="mx-3 text-sm font-medium text-hero">{item.qty}</span>
          <button
            onClick={() => onUpdateQty(item.id, item.qty + 1)}
            className="p-1 hover:bg-blue-500/30 rounded-md transition bg-hero"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="flex items-center gap-1 text-red-400 hover:text-red-500 transition"
        >
          <Trash2 size={16} />
          <span className="text-sm font-medium">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartCard;
