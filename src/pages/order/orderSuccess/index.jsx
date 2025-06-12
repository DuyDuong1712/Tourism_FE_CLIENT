import {
  CheckCircleOutlined,
  HomeOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Row, Col, Typography, Space, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { get } from "../../../utils/axios-http/axios-http";

const { Title, Text, Paragraph } = Typography;

function OrderSuccess() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);

  // Lấy thông tin từ state được truyền từ PaymentCallback
  const paymentInfo = location.state || {};

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Gọi API để lấy chi tiết booking
        const response = await get(`bookings/${bookingId}`);
        setBookingDetails(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin booking:", error);
        setError("Không thể tải thông tin đặt chỗ");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // Logic để tải xuống hóa đơn PDF
    // Có thể gọi API để generate PDF
    console.log("Tải xuống hóa đơn");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3}>Đang tải thông tin...</Title>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3} type="danger">
          {error}
        </Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Về trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 20px" }}>
      {/* Header thành công */}
      <Card style={{ textAlign: "center", marginBottom: 24 }}>
        <CheckCircleOutlined
          style={{ fontSize: 64, color: "#52c41a", marginBottom: 16 }}
        />
        <Title level={2} style={{ color: "#52c41a", marginBottom: 8 }}>
          Đặt chỗ thành công!
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
        </Text>
      </Card>

      <Row gutter={24}>
        {/* Thông tin đặt chỗ */}
        <Col xs={24} lg={14}>
          <Card title="Thông tin đặt chỗ" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Mã đặt chỗ:</Text>
                <br />
                <Text copyable style={{ fontSize: 16, color: "#1890ff" }}>
                  {bookingDetails?.id || bookingId}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Trạng thái:</Text>
                <br />
                <Tag
                  color="success"
                  style={{ fontSize: 14, padding: "4px 8px" }}
                >
                  {bookingDetails?.bookingStatus}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Ngày đặt:</Text>
                <br />
                <Text>
                  {formatDate(bookingDetails?.createdAt || new Date())}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Khách hàng:</Text>
                <br />
                <Text>{bookingDetails?.customerName || "N/A"}</Text>
              </Col>
              <Col span={24}>
                <Text strong>Địa chỉ email:</Text>
                <br />
                <Text>{bookingDetails?.customerEmail || "N/A"}</Text>
              </Col>
              <Col span={24}>
                <Text strong>Số điện thoại:</Text>
                <br />
                <Text>{bookingDetails?.customerPhone || "N/A"}</Text>
              </Col>
            </Row>
          </Card>

          {/* Chi tiết dịch vụ */}
          <Card title="Chi tiết tour" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text strong>Tên tour:</Text>
                <br />
                <Text style={{ fontSize: 16 }}>
                  {bookingDetails?.tourName || "N/A"}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Ngày khởi hành</Text>
                <br />
                <Text>
                  {formatDate(bookingDetails?.dayStart || new Date())}
                </Text>
              </Col>
              <Col span={12}>
                <Text strong>Ngày trở về</Text>
                <br />
                <Text>{formatDate(bookingDetails?.dayEnd || new Date())}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Số lượng chỗ:</Text>
                <br />
                <Text>{bookingDetails?.totalPeople || "N/A"}</Text>
              </Col>
              
              {bookingDetails?.note && (
                <Col span={24}>
                  <Text strong>Ghi chú:</Text>
                  <br />
                  <Paragraph style={{ marginBottom: 0 }}>
                    {bookingDetails.note}
                  </Paragraph>
                </Col>
              )}
            </Row>
          </Card>
        </Col>

        {/* Thông tin thanh toán */}
        <Col xs={24} lg={10}>
          <Card title="Thông tin thanh toán" style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong>Tổng tiền:</Text>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {formatCurrency(
                    paymentInfo.amount || bookingDetails?.totalAmount || 0
                  )}
                </Text>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Phương thức thanh toán:</Text>
                <Text>VNPay</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Mã giao dịch:</Text>
                <Text copyable>{paymentInfo.transactionNo || "N/A"}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Trạng thái thanh toán:</Text>
                <Tag color="success">Đã thanh toán</Tag>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Ngày thanh toán:</Text>
                <Text>{formatDate(new Date())}</Text>
              </div>
            </Space>
          </Card>

          {/* Hành động */}
          <Card title="Hành động">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                icon={<HomeOutlined />}
                block
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Thông tin hỗ trợ */}
      <Card style={{ marginTop: 24, backgroundColor: "#f6ffed" }}>
        <Title level={3} style={{ color: "#52c41a", marginBottom: 16 }}>
          Thông tin hỗ trợ
        </Title>
        <Paragraph>
          <Text strong>Hotline hỗ trợ:</Text> 1900-0909
          <br />
          <Text strong>Email:</Text> duyduongtourism@gmail.com
          <br />
          <Text strong>Giờ làm việc:</Text> 8:00 - 22:00 (Thứ 2 - Chủ nhật)
        </Paragraph>
        <Paragraph type="secondary">
          Nếu bạn có bất kỳ thắc mắc nào về đơn đặt chỗ, vui lòng liên hệ với
          chúng tôi qua các kênh hỗ trợ trên.
        </Paragraph>
      </Card>
    </div>
  );
}

export default OrderSuccess;
