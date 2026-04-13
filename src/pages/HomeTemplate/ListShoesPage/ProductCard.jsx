// src/pages/HomeTemplate/ListMoviePage/ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../Cart/slice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity < 1) return;
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: Number(quantity),
    }));
  };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative group overflow-hidden">
      <img
        className="w-full h-[320px] object-cover rounded-t-lg"
        src={product.image}
        alt={product.name}
      />

      <div className="p-5">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
          {product.name}
        </h5>
        <p className="text-red-600 font-semibold text-lg">
          {product.price?.toLocaleString()} đ
        </p>
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
        <Link
          to={`/detail/${product.id}`}
          className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 font-medium"
        >
          Xem chi tiết
        </Link>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-16 px-2 py-1 rounded border border-gray-300 text-center"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}