// src/pages/HomeTemplate/Cart/index.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { clearCart } from "./slice"; // Import action clearCart
import api from "../../../services/api"; // Đường dẫn có thể điều chỉnh

export default function Cart() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { data: user } = useSelector((state) => state.signInReducer);
  const cart = useSelector((state) => state.cartReducer);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Nếu chưa đăng nhập → chuyển hướng
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) return;

    setLoading(true);
    setMessage("");

    try {
      const orderDetail = cart.items.map((item) => ({
        productId: String(item.id),   // productId phải là string
        quantity: Number(item.quantity),
      }));

      const payload = {
        orderDetail: orderDetail,
        email: user.email || "",      // Lấy email từ user đã đăng nhập
      };

      const response = await api.post("/Users/order", payload);
      // Thành công
      alert("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
      console.log("✅ Đặt hàng thành công:", response.data);

      setMessage("🎉 Đặt hàng thành công! Cảm ơn bạn.");
      
      // Xóa giỏ hàng sau khi đặt hàng thành công
      dispatch(clearCart());

    } catch (error) {
      console.error("❌ Đặt hàng thất bại:", error.response?.data || error.message);
      setMessage("❌ Đặt hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold mb-10">Giỏ hàng của bạn</h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500">Giỏ hàng của bạn đang trống</p>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-12">
            {cart.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-6 bg-white p-6 rounded-3xl shadow-md border border-gray-100"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-2xl"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-xl">{item.name}</h3>
                  <p className="text-gray-600 mt-1">Size: {item.size}</p>
                  <p className="text-red-600 font-medium mt-2">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold">x{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng tiền + Nút đặt hàng */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex justify-between items-center text-2xl font-bold mb-6">
              <span>Tổng tiền:</span>
              <span className="text-red-600">
                {totalAmount.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white py-5 rounded-3xl text-xl font-semibold transition-all"
            >
              {loading ? "Đang xử lý đơn hàng..." : "ĐẶT HÀNG NGAY"}
            </button>

            {message && (
              <p
                className={`mt-6 text-center text-lg font-medium ${
                  message.includes("thành công") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}