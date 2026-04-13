// src/pages/HomeTemplate/DetailShoes/index.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail } from "./slice";
import { addToCart } from "../Cart/slice";

const DetailShoes = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: product, loading } = useSelector((state) => state.detailProductReducer);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizes, setSizes] = useState([]);        // ← State riêng cho sizes
  const [parseError, setParseError] = useState(false);

  // Fetch dữ liệu
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetail(id));
      setSelectedSize("");   // Reset size khi đổi sản phẩm
      setSizes([]);
    }
  }, [dispatch, id]);

  // Parse size khi product thay đổi
  useEffect(() => {
    if (!product?.size) {
      setSizes([]);
      return;
    }

    try {
      let parsedSizes = [];

      if (typeof product.size === "string") {
        parsedSizes = JSON.parse(product.size);
      } else if (Array.isArray(product.size)) {
        parsedSizes = product.size;
      }

      // Đảm bảo là mảng số
      if (Array.isArray(parsedSizes)) {
        setSizes(parsedSizes.map(s => String(s).trim())); // chuyển thành string để an toàn
        setParseError(false);
      } else {
        throw new Error("Size không phải mảng");
      }
    } catch (err) {
      console.error("❌ Parse size thất bại:", err, " - Giá trị size nhận được:", product.size);
      setParseError(true);
      setSizes([]);
    }
  }, [product]);

  // Debug: Mở console để xem dữ liệu
  useEffect(() => {
    if (product) {
      console.log("📦 Product data:", product);
      console.log("📏 Field size nhận được:", product.size);
      console.log("✅ Sizes sau khi parse:", sizes);
    }
  }, [product, sizes]);

  if (loading) {
    return <p className="text-center py-20 text-xl">Đang tải thông tin giày...</p>;
  }

  if (!product) {
    return <p className="text-center py-20 text-xl text-red-500">Không tìm thấy sản phẩm</p>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Vui lòng chọn kích cỡ giày!");
      return;
    }
    if (quantity < 1) return;

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: Number(quantity),
        size: selectedSize,
      })
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Hình ảnh */}
        <div className="lg:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-3xl shadow-2xl object-cover"
          />
        </div>

        {/* Thông tin */}
        <div className="lg:w-1/2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-3xl font-semibold text-red-600 mt-3">
              {product.price?.toLocaleString("vi-VN")} ₫
            </p>
          </div>

          <div className="prose text-gray-600">
            <p>{product.description}</p>
          </div>

          {/* Chọn size */}
          <div className="pt-4">
            <div className="flex justify-between mb-3">
              <strong className="text-lg">Chọn kích cỡ (EU)</strong>
              {parseError && <span className="text-red-500 text-sm">Lỗi parse size từ API</span>}
            </div>

            {sizes.length > 0 ? (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-14 rounded-2xl font-semibold text-xl transition-all border-2
                      ${selectedSize === size 
                        ? "bg-black text-white border-black shadow-md" 
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Sản phẩm này không có thông tin kích cỡ</p>
            )}

            {selectedSize && (
              <p className="mt-3 text-green-600 font-medium">
                ✓ Đã chọn: Size {selectedSize}
              </p>
            )}
          </div>

          {/* Số lượng */}
          <div>
            <strong className="block mb-3 text-lg">Số lượng</strong>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 border border-gray-300 rounded-2xl text-3xl hover:bg-gray-100"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-28 text-center text-3xl font-medium border border-gray-300 rounded-2xl py-3"
              />
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-12 border border-gray-300 rounded-2xl text-3xl hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-black hover:bg-gray-900 text-white py-5 rounded-3xl text-xl font-bold mt-6"
          >
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailShoes;