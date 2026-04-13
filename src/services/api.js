// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://shop.cyberlearn.vn/api",
  timeout: 10000, // tránh treo quá lâu
});

api.interceptors.request.use(
  (config) => {
    // TokenCybersoft (bắt buộc)
    config.headers.TokenCybersoft =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5MSIsIkhldEhhblN0cmluZyI6IjAyLzA5LzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc4ODMwNzIwMDAwMCIsIm5iZiI6MTc1OTk0MjgwMCwiZXhwIjoxNzg4NDU0ODAwfQ.3f2gLYDZla_lDH4GWmfgSe9Il_QHrpoHIWhW6FSKTi8";

    // Lấy token từ localStorage
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo?.accessToken) {
          config.headers.Authorization = `Bearer ${userInfo.accessToken}`;
          console.log("🔑 Gửi Authorization Bearer Token:", userInfo.accessToken.substring(0, 40) + "...");
        } else {
          console.warn("⚠️ Có userInfo nhưng không có accessToken");
        }
      } catch (err) {
        console.error("❌ Lỗi parse userInfo từ localStorage:", err);
      }
    } else {
      console.warn("⚠️ Không tìm thấy userInfo trong localStorage");
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Interceptor response để debug lỗi 401 dễ hơn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("❌ 401 Unauthorized - Token không hợp lệ hoặc hết hạn");
      console.error("Response data:", error.response?.data);
      // Có thể tự động logout nếu token invalid
      // localStorage.removeItem("userInfo");
    }
    return Promise.reject(error);
  }
);

export default api;