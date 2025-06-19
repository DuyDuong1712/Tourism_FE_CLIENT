import React, { useEffect, useState } from "react";
import "./style.scss";
import {
  Card,
  Button,
  message,
  Modal,
  Space,
  Image,
  Row,
  Col,
  Empty,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  HeartOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { get, getUser, deleteMethod } from "../../utils/axios-http/axios-http";
import { useNavigate } from "react-router-dom";

function UserFavorite() {
  const [favoriteData, setFavoriteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin người dùng
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

  // Lấy danh sách tour yêu thích
  const fetchFavorites = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await get(`favorites/users/${userId}`);
      const favorites = Array.isArray(response.data)
        ? response.data
        : response.data?.favorites && Array.isArray(response.data.favorites)
        ? response.data.favorites
        : [];
      setFavoriteData(favorites);
      if (favorites.length === 0) {
        message.info("Bạn chưa có tour yêu thích nào!");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi khi lấy danh sách tour yêu thích!"
      );
      console.error("Fetch favorites error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị modal xác nhận xóa
  const showDeleteModal = (tour) => {
    setSelectedTour(tour);
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedTour(null);
  };

  // Xóa trực tiếp từ card
  const handleQuickDelete = async (tour, e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await deleteMethod(`favorites`, { tourId: tour.tourId });
      message.success("Đã xóa tour khỏi danh sách yêu thích!");
      if (userId) await fetchFavorites(userId);
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi xóa tour yêu thích!"
      );
      console.error("Delete favorite error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xem chi tiết tour
  const viewTourDetail = (tourId, title) => {
    navigate(`/tour-details/${tourId}/${title}`);
  };

  // Thêm vào giỏ hàng
  const addToCart = (tour, e) => {
    e.stopPropagation();
    // Logic thêm vào giỏ hàng
    message.success(`Đã thêm "${tour.tourName}" vào giỏ hàng!`);
  };

  // Gọi API khi component mount
  useEffect(() => {
    const getData = async () => {
      let currentUserId = await fetchUserProfile();
      if (currentUserId) {
        await fetchFavorites(currentUserId);
      } else {
        message.error("Vui lòng đăng nhập để xem danh sách yêu thích!");
        navigate("/login");
      }
    };
    getData();
  }, [navigate]);

  // Render card sản phẩm
  const renderFavoriteCard = (tour) => (
    <Card
      key={tour.id || tour.tourId}
      style={{
        marginBottom: 16,
        border: "1px solid #e8e8e8",
        borderRadius: 8,
        backgroundColor: "#f8f9fa",
        cursor: "pointer",
        position: "relative",
      }}
      bodyStyle={{ padding: 16 }}
      hoverable
      onClick={() => viewTourDetail(tour.tourId)}
    >
      {/* Nút xóa ở góc phải */}
      <Button
        type="text"
        icon={<CloseOutlined />}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
        size="small"
        onClick={(e) => handleQuickDelete(tour, e)}
      />

      <Row gutter={16} align="middle">
        {/* Hình ảnh sản phẩm */}
        <Col xs={6} sm={4}>
          <Image
            width="100%"
            height={80}
            src={tour.tourImages}
            alt={tour.title}
            style={{
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #e8e8e8",
            }}
            fallback="/default-tour.jpg"
            preview={false}
          />
        </Col>

        {/* Thông tin sản phẩm */}
        <Col xs={12} sm={14}>
          <div>
            <h4
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: "16px",
                fontWeight: "500",
                color: "#1890ff",
                cursor: "pointer",
              }}
            >
              {tour.title}
            </h4>
            <div
              style={{
                color: "#666",
                fontSize: "13px",
                marginBottom: 4,
              }}
            >
              Danh mục: {tour.category}
            </div>
            <div
              style={{
                color: "#666",
                fontSize: "13px",
                marginBottom: 4,
              }}
            >
              Điểm khởi hành: {tour.departure}
            </div>
            <div
              style={{
                color: "#666",
                fontSize: "13px",
                marginBottom: 4,
              }}
            >
              Điểm đến : {tour.destination || tour.tourDestination}
            </div>
          </div>
        </Col>

        {/* Giá và hành động */}
        <Col xs={6} sm={6} style={{ textAlign: "right" }}>
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#ff4d4f",
                marginBottom: 4,
              }}
            >
              Giá từ: {(tour.price || tour.tourPrice)?.toLocaleString("vi-VN")}{" "}
              đ
            </div>
          </div>

          <Button
            type="primary"
            danger
            size="small"
            style={{
              backgroundColor: "#dc3545",
              borderColor: "#dc3545",
              borderRadius: 4,
              fontSize: "12px",
              height: "28px",
            }}
            onClick={(e) => viewTourDetail(tour.tourId, tour.title)}
          >
            Xem chi tiết
          </Button>
        </Col>
      </Row>
    </Card>
  );

  return (
    <div
      className="layout-container"
      style={{ padding: "20px", backgroundColor: "#fff" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <HeartOutlined
          style={{
            fontSize: "24px",
            color: "#ff4d4f",
            marginRight: 12,
          }}
        />
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Sản phẩm yêu thích
        </h2>
      </div>

      {/* Danh sách tour yêu thích */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <span>Đang tải...</span>
        </div>
      ) : favoriteData.length === 0 ? (
        <Empty
          description="Bạn chưa có tour yêu thích nào!"
          style={{ padding: "40px 0" }}
        />
      ) : (
        <div>
          {favoriteData.map((tour) => renderFavoriteCard(tour))}

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
      )}
    </div>
  );
}

export default UserFavorite;
