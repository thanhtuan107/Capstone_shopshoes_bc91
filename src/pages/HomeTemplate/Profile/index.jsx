// src/pages/HomeTemplate/Profile/index.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile, changePassword } from "./slice";
import { logout } from "../SignIn/slice";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: profileData, loading, error, successMessage } = useSelector((state) => state.profileReducer);
  const { data: authUser } = useSelector((state) => state.signInReducer);

  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",      // tên hiển thị
    email: "",
    phone: "",     // số điện thoại
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  useEffect(() => {
  const userInfo = localStorage.getItem("userInfo");

  if (!userInfo) {
    navigate("/signin");
  }
}, []);
  // Gọi API lấy thông tin profile
  useEffect(() => {
    if (authUser) {
      dispatch(getProfile());
    } else {
      navigate("/signin", { replace: true });
    }
  }, [dispatch, authUser, navigate]);

  // Fill dữ liệu từ API vào form (đã map đúng field)
  useEffect(() => {
    if (profileData) {
      console.log("✅ Đang fill dữ liệu:", profileData);

      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    }));
    setEditMode(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    dispatch(changePassword({
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
    }));
    setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  if (loading && !profileData) {
    return <p className="text-center py-20 text-xl">Đang tải thông tin cá nhân...</p>;
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-10 text-center">Thông tin tài khoản</h1>

      {error && <p className="text-red-500 bg-red-50 p-4 rounded-2xl text-center mb-6">{error}</p>}
      {successMessage && <p className="text-green-600 bg-green-50 p-4 rounded-2xl text-center mb-6">{successMessage}</p>}

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Thông tin cá nhân</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-6 py-2 rounded-2xl font-medium ${editMode ? "bg-gray-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {editMode ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
          </button>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Tài khoản (không sửa được) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tài khoản</label>
            <input
              type="text"
              value={profileData?.email || authUser?.email || ""}
              disabled
              className="w-full px-5 py-4 bg-gray-100 border border-gray-300 rounded-2xl text-gray-600"
            />
          </div>

          {/* Họ tên / Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl disabled:bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl disabled:bg-gray-100"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl disabled:bg-gray-100"
            />
          </div>

          {editMode && (
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-3xl text-lg font-semibold transition"
            >
              Lưu thay đổi
            </button>
          )}
        </form>
      </div>

      {/* Đổi mật khẩu */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Đổi mật khẩu</h2>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu cũ</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              required
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-3xl text-lg font-semibold"
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>

      <button
        onClick={handleLogout}
        className="mt-12 w-full bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-3xl text-lg font-semibold"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Profile;