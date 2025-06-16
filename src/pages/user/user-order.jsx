import React, { useEffect, useState } from "react";
import "./style.scss";
import { Table, Tag, Select, Space, Button, message, Modal, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { get, getUser, patch } from "../../utils/axios-http/axios-http";
import { useNavigate } from "react-router-dom";

function UserOrder() {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [userId, setUserId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const navigate = useNavigate();

  // Lấy userId từ localStorage hoặc API
  const fetchUserProfile = async () => {
    try {
      const response = await getUser("users/profile");
      const user = response.data;
      setUserId(user.id);
      localStorage.setItem("userId", user.id);
      return user.id;
    } catch (error) {
      message.error("Lỗi khi lấy thông tin người dùng!");
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        navigate("/login");
      }
      return null;
    }
  };

  // Lấy danh sách booking
  const fetchBookings = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await get(
        `users/${userId}/bookings${
          statusFilter ? `?status=${statusFilter}` : ""
        }`
      );
      const bookings = Array.isArray(response.data)
        ? response.data
        : response.data.bookings || [];
      setBookingData(bookings);
      if (bookings.length === 0) {
        message.info("Bạn chưa có booking tour nào!");
      }
    } catch (error) {
      message.error("Lỗi khi lấy danh sách booking!");
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tính toán chính sách hủy dựa trên ngày khởi hành (chỉ áp dụng cho CONFIRMED)
  const getCancellationPolicy = (startDate, totalAmount) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Số ngày còn lại

    let penaltyPercentage = 0;
    let penaltyAmount = 0;

    if (diffDays < 7) {
      penaltyPercentage = 100;
      penaltyAmount = totalAmount;
    } else if (diffDays < 15) {
      penaltyPercentage = 40;
      penaltyAmount = totalAmount * 0.4;
    } else if (diffDays < 30) {
      penaltyPercentage = 20;
      penaltyAmount = totalAmount * 0.2;
    }

    return {
      daysLeft: diffDays,
      penaltyPercentage,
      penaltyAmount,
      refundAmount: totalAmount - penaltyAmount,
    };
  };

  // Xử lý hủy booking
  const handleCancelBooking = (record) => {
    const isConfirmed = record.bookingStatus === "CONFIRMED";
    let content;
    let payload = {};

    if (isConfirmed) {
      const { daysLeft, penaltyPercentage, penaltyAmount, refundAmount } =
        getCancellationPolicy(record.startDate, record.totalAmount);
      payload = { penaltyAmount, refundAmount, cancelReason };

      content = (
        <div>
          <p>
            <strong>Tên tour:</strong> {record.tourName}
          </p>
          <p>
            <strong>Ngày khởi hành:</strong>{" "}
            {new Date(record.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Số ngày còn lại:</strong> {daysLeft} ngày
          </p>
          <p>
            <strong>Chính sách hủy:</strong>
          </p>
          <ul style={{ listStyle: "none" }}>
            {daysLeft < 7 && (
              <li>
                Mất 100% tiền:{" "}
                {penaltyAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </li>
            )}
            {daysLeft >= 7 && daysLeft < 15 && (
              <li>
                Mất 40% tiền:{" "}
                {penaltyAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </li>
            )}
            {daysLeft >= 15 && daysLeft < 30 && (
              <li>
                Mất 20% tiền:{" "}
                {penaltyAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </li>
            )}
            {daysLeft >= 30 && (
              <li>
                Hoàn tiền 100%:{" "}
                {refundAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </li>
            )}
          </ul>
          <p>
            <strong>Số tiền hoàn lại:</strong>{" "}
            {refundAmount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <p>
            <strong>Lý do hủy:</strong>
          </p>
          <Input.TextArea
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Nhập lý do hủy tour"
          />
        </div>
      );
    } else {
      // PENDING: Hủy miễn phí
      payload = {
        penaltyAmount: 0,
        refundAmount: record.totalAmount,
        cancelReason,
      };
      content = (
        <div>
          <p>
            <strong>Tên tour:</strong> {record.tourName}
          </p>
          <p>
            <strong>Ngày khởi hành:</strong>{" "}
            {new Date(record.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Lý do hủy:</strong>
          </p>
          <Input.TextArea
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Nhập lý do hủy tour"
          />
        </div>
      );
    }

    Modal.confirm({
      title: "Xác nhận hủy tour",
      content,
      okText: "Hủy Tour",
      cancelText: "Quay lại",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true);
          await patch(`bookings/${record.id}/cancel`, payload);
          message.success("Hủy tour thành công!");
          if (userId) await fetchBookings(userId);
        } catch (error) {
          message.error(error.response?.data || "Lỗi khi hủy tour!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Gọi API khi component mount hoặc statusFilter thay đổi
  useEffect(() => {
    const getData = async () => {
      let currentUserId = localStorage.getItem("userId");

      if (!currentUserId) {
        currentUserId = await fetchUserProfile();
      } else {
        setUserId(currentUserId);
      }

      if (currentUserId) {
        await fetchBookings(currentUserId);
      } else {
        message.error("Vui lòng đăng nhập để xem booking!");
        navigate("/login");
      }
    };

    const debounceFetch = setTimeout(getData, 300);
    return () => clearTimeout(debounceFetch);
  }, [statusFilter, navigate]);

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => <a>{index + 1}</a>,
    },
    {
      title: "Mã Booking",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên Tour",
      dataIndex: "tourName",
      key: "tourName",
    },
    {
      title: "Số Người",
      dataIndex: "totalPeople",
      key: "totalPeople",
    },
    {
      title: "Ngày Khởi Hành",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      title: "Trạng Thái Booking",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => {
        let color = "";
        let displayText = status;

        switch (status) {
          case "CONFIRMED":
            color = "green";
            displayText = "Đã xác nhận";
            break;
          case "CANCELLED":
            color = "red";
            displayText = "Đã hủy";
            break;
          case "COMPLETED":
            color = "blue";
            displayText = "Đã hoàn thành";
            break;
          default:
            color = "orange";
            displayText = "Đang chờ";
            break;
        }
        return <Tag color={color}>{displayText}</Tag>;
      },
    },
    {
      title: "Trạng Thái Thanh Toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        let color = "";
        let displayText = status;

        switch (status) {
          case "PAID":
            color = "green";
            displayText = "Đã thanh toán";
            break;
          case "FAILED":
            color = "red";
            displayText = "Thanh toán thất bại";
            break;
          case "REFUNDED":
            color = "purple";
            displayText = "Đã hoàn tiền";
            break;
          default:
            color = "orange";
            displayText = "Chưa thanh toán";
            break;
        }
        return <Tag color={color}>{displayText}</Tag>;
      },
    },
    {
      title: "Ngày Đặt",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => (date ? new Date(date).toLocaleString() : "-"),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {(record.bookingStatus === "PENDING" ||
            record.bookingStatus === "CONFIRMED") && (
            <Button
              onClick={() => handleCancelBooking(record)}
              type="default"
              icon={<DeleteOutlined />}
              style={{ marginLeft: 1 }}
              danger
            >
              Hủy Tour
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Tùy chọn cho bộ lọc trạng thái
  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "PENDING", label: "Đang chờ" },
    { value: "CONFIRMED", label: "Đã xác nhận" },
    { value: "CANCELLED", label: "Đã hủy" },
    { value: "COMPLETED", label: "Đã hoàn thành" },
  ];

  return (
    <div className="layout-container">
      <h2 style={{ marginTop: 20, marginBottom: 100 }}>
        Danh sách đơn hàng
      </h2>

      <Table
        dataSource={bookingData || []}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 12 }}
        className="table-container"
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}

export default UserOrder;
