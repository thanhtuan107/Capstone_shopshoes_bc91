import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

export default function CartIcon() {
  const cart = useSelector((state) => state.cartReducer);
  const navigate = useNavigate();

  return (
    <button
      className="relative ml-4"
      onClick={() => navigate("/cart")}
      aria-label="Giỏ hàng"
    >
      <FaShoppingCart className="text-2xl text-blue-600" />
      {cart.items.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-xs">
          {cart.items.length}
        </span>
      )}
    </button>
  );
}
