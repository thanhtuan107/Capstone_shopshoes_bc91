import React, { useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShowtimeDetail,
  confirmBooking,
  addSelectedSeat,
  removeSelectedSeat,
} from "./slice";
import "./style.scss";

export default function BookingPage() {
  const { id } = useParams(); // ID lịch chiếu
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Kết hợp dữ liệu từ bookingReducer và signInReducer
  const { booking, data } = useSelector((state) => ({
    booking: state.bookingReducer,
    data: state.signInReducer.data,
  }));

  // Lấy các thuộc tính từ booking
  const { showtimeDetail, loading, selectedSeats, totalAmount, bookingStatus, error } = booking;

  // Nếu chưa đăng nhập, chuyển hướng về trang /signin với query redirect=/booking
  if (!data) {
    return <Navigate to="/signin" />;
  }

  useEffect(() => {
    // Reset selectedSeats when the component mounts or id changes
    dispatch({ type: "booking/resetSelectedSeats" }); // Add a reset action if needed
    dispatch(fetchShowtimeDetail(id))
      .unwrap()
      .catch((err) => console.error("Lỗi tải dữ liệu:", err));
  }, [dispatch, id]);

  // Xử lý chọn/bỏ chọn ghế
  const handleSelectSeat = (seat) => {
    if (!seat || seat.daDat) return; // Không làm gì nếu ghế đã đặt hoặc không tồn tại

    const isSelected = selectedSeats.some((s) => s.maGhe === seat.maGhe);

    if (isSelected) {
      dispatch(removeSelectedSeat(seat.maGhe));
    } else {
      dispatch(addSelectedSeat({ ...seat, giaVe: seat.giaVe || 75000 }));
    }
  };

  console.log("selectedSeats", selectedSeats);

  // Xác nhận đặt vé
  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const taiKhoanNguoiDung = userInfo.taiKhoan || "user123"; // Dùng tài khoản từ localStorage hoặc mặc định

    const danhSachVe = selectedSeats.map((seat) => ({
      maGhe: seat.maGhe,
      giaVe: seat.giaVe,
    }));

    dispatch(
      confirmBooking({
        maLichChieu: id,
        danhSachVe,
        taiKhoanNguoiDung,
      })
    )
      .unwrap()
      .then(() => {
        alert("Đặt vé thành công!");
        navigate("/"); // Chuyển về trang chủ sau khi đặt vé
      })
      .catch((err) => {
        alert(`Đặt vé thất bại: ${err.message || "Vui lòng thử lại!"}`);
      });
  };

  if (loading) return <p className="text-center text-xl">Đang tải...</p>;
  if (
    !showtimeDetail ||
    !showtimeDetail.danhSachGhe ||
    showtimeDetail.danhSachGhe.length === 0
  )
    return (
      <p className="text-center text-xl">
        Không tìm thấy thông tin lịch chiếu hoặc dữ liệu ghế.
      </p>
    );

  const { thongTinPhim, danhSachGhe } = showtimeDetail;

  // Tạo sơ đồ ghế 11 hàng, 12 cột
  const createSeatGrid = () => {
    const rows = 11; // 11 hàng
    const cols = 12; // 12 cột
    const seatGrid = Array.from({ length: rows }, () => Array(cols).fill(null));

    // Điền ghế vào lưới dựa trên danhSachGhe
    danhSachGhe.forEach((seat) => {
      const row = parseInt(seat.tenGhe?.charAt(0)) - 1 || 0; // Lấy hàng (A=0, B=1, ...)
      const col = parseInt(seat.tenGhe?.slice(1) || seat.maGhe % 12 || 1) - 1; // Lấy cột (1-12)
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        seatGrid[row][col] = seat;
      }
    });

    return seatGrid;
  };

  const seatGrid = createSeatGrid();
 

  return (
    <div className="booking-container">
      {/* Thông tin phim */}
      <div className="movie-info">
        <h1 className="movie-title">{thongTinPhim.tenPhim}</h1>
        <p>
          <strong>Ngày chiếu:</strong> {thongTinPhim.ngayChieu} -{" "}
          {thongTinPhim.gioChieu}
        </p>
        <p>
          <strong>Cụm rạp:</strong> {thongTinPhim.tenCumRap}
        </p>
        <p>
          <strong>Rạp:</strong> {thongTinPhim.tenRap}
        </p>
      </div>
      {/* Sơ đồ ghế */}
      <div className="grid grid-cols-12 gap-2 mt-4">
        {danhSachGhe.map((seat) => (
          <button
            key={seat.maGhe}
            className={`seat ${seat.daDat ? "seat-booked" : ""} ${
              selectedSeats.some((s) => s.maGhe === seat.maGhe)
                ? "seat-selected"
                : seat.loaiGhe === "Vip"
                ? "seat-vip"
                : ""
            }`}
            onClick={() => handleSelectSeat(seat)}
          >
            {seat.tenGhe}
          </button>
        ))}
      </div>
      Đã gửi
      {/* Danh sách ghế đã chọn */}
      <div className="selected-seats">
        <h2 className="text-xl font-semibold">Ghế đã chọn</h2>
        <div className="seat-list flex flex-wrap gap-2">
          {selectedSeats.map((seat) => (
            <span key={seat.maGhe} className="seat-badge">
              {seat.maGhe}
            </span>
          ))}
        </div>
      </div>
      {/* Tổng tiền */}
      <div className="total-price">
        <h2 className="text-xl font-semibold">
          Tổng tiền: {totalAmount.toLocaleString()} VND
        </h2>
      </div>
      {/* Nút đặt vé */}
      <div className="booking-button">
        <button
          onClick={handleConfirmBooking}
          className="btn-confirm"
          disabled={selectedSeats.length === 0 || loading}
        >
          {loading ? "Đang xử lý..." : "Xác nhận đặt vé"}
        </button>
      </div>
      {/* Trạng thái đặt vé hoặc lỗi */}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {bookingStatus && (
        <p className="text-green-500 text-center">{bookingStatus}</p>
      )}
    </div>
  );
}
