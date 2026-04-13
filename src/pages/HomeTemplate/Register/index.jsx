import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actRegister, resetRegister } from "./slice"; // Điều chỉnh đường dẫn cho slice register của bạn
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State quản lý giá trị form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    gender: true,
    phone: "",
     // mặc định nam
  });

  // Lấy trạng thái đăng ký từ Redux store (key 'register')
  const { loading, error, data } = useSelector(
    (state) => state.registerReducer,
  );

  // Cập nhật giá trị các trường input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form đăng ký
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }
    // Payload gửi đi phải đúng định dạng API yêu cầu
    const payload = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      gender: formData.gender,
      phone: formData.phone,
      
    };
    dispatch(actRegister(payload));
  };

  // Sau khi đăng ký thành công, reset slice và chuyển hướng về trang SignIn
  useEffect(() => {
    if (data) {
      dispatch(resetRegister());
      navigate("/signin");
    }
  }, [data, dispatch, navigate]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Đăng ký</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Tài khoản</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Xác nhận mật khẩu</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Họ tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        {/* Gender */}
        <label className="block mb-1">Giới tính</label>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value={true}>Nam</option>
          <option value={false}>Nữ</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default Register;
