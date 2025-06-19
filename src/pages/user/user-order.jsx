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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin
  const fetchUserProfile = async () => {
    try {
      const response = await getUser("users/profile");
      const user = response.data;
      setUserId(user.id);
      return user.id;
    } catch (error) {
      message.error("Lỗi khi lấy thông tin người dùng!");
      console.error("Fetch user profile error:", error);
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
        `bookings/users/${userId}${
          statusFilter ? `?status=${statusFilter}` : ""
        }`
      );
      const bookings = Array.isArray(response.data)
        ? response.data
        : response.data?.bookings && Array.isArray(response.data.bookings)
        ? response.data.bookings
        : [];
      setBookingData(bookings);
      if (bookings.length === 0) {
        message.info("Bạn chưa có booking tour nào!");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi lấy danh sách booking!"
      );
      console.error("Fetch bookings error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tính toán chính sách hủy
  const getCancellationPolicy = (startDate, totalAmount) => {
    const today = new Date();
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return {
        daysLeft: 0,
        penaltyPercentage: 100,
        penaltyAmount: totalAmount,
        refundAmount: 0,
      };
    }
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let penaltyPercentage = 0;
    let penaltyAmount = 0;

    if (diffDays < 7) {
      penaltyPercentage = 100;
      penaltyAmount = totalAmount;
    } else if (diffDays < 15) {
      penaltyPercentage = 40;
      penaltyAmount = totalAmount * 0.4;
    } else {
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

  // Mở modal hủy booking
  const showCancelModal = (record) => {
    setSelectedRecord(record);
    setCancelReason(""); // Reset lý do hủy
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
    setCancelReason("");
  };

  // Xác nhận hủy booking
  const handleConfirmCancel = async () => {
    if (!selectedRecord) return;

    // const isConfirmed = selectedRecord.bookingStatus === "CONFIRMED";
    // let payload = {};

    // if (isConfirmed) {
    //   const { penaltyAmount, refundAmount } = getCancellationPolicy(
    //     selectedRecord.startDate,
    //     selectedRecord.totalAmount
    //   );
    //   payload = { penaltyAmount, refundAmount, cancelReason };
    // } else {
    //   payload = {
    //     penaltyAmount: 0,
    //     refundAmount: selectedRecord.totalAmount,
    //     cancelReason,
    //   };
    // }

    let payload = {
      cancelReason,
    };

    try {
      setLoading(true);
      await patch(`bookings/${selectedRecord.id}/cancel`, payload);
      message.success("Hủy tour thành công!");
      handleModalCancel();
      if (userId) await fetchBookings(userId);
    } catch (error) {
      message.error(
        error.response?.data?.message || error.message || "Lỗi khi hủy tour!"
      );
      console.error("Cancel booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render nội dung modal
  const renderModalContent = () => {
    if (!selectedRecord) return null;

    const isConfirmed = selectedRecord.bookingStatus === "CONFIRMED";

    if (isConfirmed) {
      const { daysLeft, penaltyAmount, refundAmount } = getCancellationPolicy(
        selectedRecord.startDate,
        selectedRecord.totalAmount
      );

      return (
        <div>
          <p>
            <strong>Tên tour:</strong> {selectedRecord.tourName}
          </p>
          <p>
            <strong>Ngày khởi hành:</strong>{" "}
            {new Date(selectedRecord.startDate).toLocaleDateString()}
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
            {daysLeft >= 15 && (
              <li>
                Mất 20% tiền:{" "}
                {penaltyAmount.toLocaleString("vi-VN", {
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
      return (
        <div>
          <p>
            <strong>Tên tour:</strong> {selectedRecord.tourName}
          </p>
          <p>
            <strong>Ngày khởi hành:</strong>{" "}
            {new Date(selectedRecord.startDate).toLocaleDateString()}
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
  };

  // Gọi API khi component mount hoặc statusFilter thay đổi
  useEffect(() => {
    const getData = async () => {
      let currentUserId = await fetchUserProfile();
      if (currentUserId) {
        await fetchBookings(currentUserId);
      } else {
        message.error("Vui lòng đăng nhập để xem booking!");
        navigate("/login");
      }
    };
    getData();
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
          case "PENDING":
            color = "orange";
            displayText = "Đang chờ";
            break;
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
            color = "grey";
            displayText = "Không xác định";
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
            (record.bookingStatus === "CONFIRMED" &&
              new Date(record.startDate) > new Date())) && (
            <Button
              onClick={() => showCancelModal(record)}
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
      <h2 style={{ marginTop: 20, marginBottom: 20 }}>Danh sách đơn hàng</h2>
      <Select
        style={{ width: 200, marginBottom: 20 }}
        value={statusFilter}
        onChange={(value) => setStatusFilter(value)}
        options={statusOptions}
        placeholder="Chọn trạng thái"
      />
      <Table
        dataSource={bookingData || []}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 12 }}
        className="table-container"
        style={{ cursor: "pointer" }}
        locale={{ emptyText: "Bạn chưa có booking tour nào!" }}
      />

      {/* Modal hủy booking */}
      <Modal
        title="Xác nhận hủy tour"
        visible={isModalVisible}
        onOk={handleConfirmCancel}
        onCancel={handleModalCancel}
        okText="Hủy Tour"
        cancelText="Quay lại"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        {renderModalContent()}
      </Modal>

      <div>
        {/* Link quay lại */}
        <div style={{ marginTop: 24, textAlign: "left" }}>
          <Button
            type="link"
            style={{
              padding: 0,
              fontSize: "14px",
              color: "#1890ff",
            }}
            onClick={() => navigate(-1)}
          >
            « Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserOrder;
