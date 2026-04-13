// src/pages/HomeTemplate/SignIn/index.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actLogin } from "./slice";
import { useNavigate, useLocation } from "react-router-dom";

const SignInPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, data: user } = useSelector((state) => state.signInReducer);

 const [credentials, setCredentials] = useState({
  email: "",       // đổi từ taiKhoan
  password: "",    // đổi từ matKhau
});

  // Lấy thông tin trang trước đó (nếu có)
  const from = location.state?.from?.pathname || "/cart";

  // Xử lý sau khi đăng nhập thành công
  useEffect(() => {
    if (user) {
      // Nếu trước đó muốn vào giỏ hàng → quay lại giỏ hàng
      // Nếu không → về trang chủ
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(actLogin(credentials));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Đăng nhập</h1>

        {error && (
          <p className="text-red-500 text-center mb-6 bg-red-50 p-3 rounded-xl">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tài khoản
            </label>
            <input
              type="text"
              name="email"
              value={credentials.email}
              onChange={handleOnChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-black transition"
              placeholder="Nhập tài khoản"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleOnChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-black transition"
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-gray-900 transition disabled:opacity-70"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;