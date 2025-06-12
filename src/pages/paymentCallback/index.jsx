import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Giả sử sử dụng axios để gọi API
import { Spin } from "antd"; // Component loading của Ant Design

function PaymentCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode"); // Mã phản hồi từ VNPAY
    const orderIdParam = searchParams.get("vnp_TxnRef"); // Mã đơn hàng
    const orderId = orderIdParam ? Number(orderIdParam) : 0;
    const vnp_TransactionNo = searchParams.get("vnp_TransactionNo"); // Mã giao dịch tại VNPAY
    const vnp_Amount = searchParams.get("vnp_Amount"); // Số tiền thanh toán

    // Kiểm tra tính hợp lệ của các tham số
    if (!vnp_ResponseCode || !orderId) {
      setErrorMessage("Dữ liệu thanh toán không hợp lệ.");
      setLoading(false);
      return;
    }

    if (vnp_ResponseCode === "00") {
      // Thanh toán thành công
      handlePaymentSuccess(orderId, vnp_TransactionNo, vnp_Amount);
    } else {
      // Thanh toán thất bại
      handlePaymentFailure(vnp_ResponseCode);
    }
  }, [location.search]);

  const handlePaymentSuccess = async (orderId, transactionNo, amount) => {
    try {
      // Gọi API để cập nhật trạng thái đơn hàng
      const response = await axios.post("/api/orders/update-status", {
        orderId,
        status: "PAID",
        transactionNo,
        amount: Number(amount) / 100, // VNPAY trả về số tiền nhân 100
      });

      if (response.status === 200) {
        setPaymentSuccess(true);
        message.success("Thanh toán thành công! Đơn hàng đã được cập nhật.");
        console.log(
          "Thanh toán thành công, orderId:",
          orderId,
          "transactionNo:",
          transactionNo
        );

        // Chuyển hướng sau 3 giây
        setTimeout(() => {
          navigate(`/order-success?orderId=${orderId}`);
        }, 3000);
      } else {
        throw new Error("Cập nhật đơn hàng thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      setErrorMessage(
        "Đã xảy ra lỗi khi xử lý đơn hàng. Vui lòng liên hệ hỗ trợ."
      );
      setPaymentSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = (responseCode) => {
    setPaymentSuccess(false);
    setLoading(false);

    // Xử lý các mã lỗi cụ thể từ VNPAY
    let errorMsg = "Thanh toán thất bại.";
    switch (responseCode) {
      case "24":
        errorMsg = "Giao dịch bị hủy bởi người dùng.";
        break;
      case "13":
        errorMsg = "Giao dịch không thành công do thông tin thẻ không hợp lệ.";
        break;
      case "07":
        errorMsg = "Giao dịch bị nghi ngờ gian lận.";
        break;
      default:
        errorMsg = `Thanh toán thất bại. Mã lỗi: ${responseCode}.`;
    }

    message.error(errorMsg);
    setErrorMessage(errorMsg);
    console.log("Thanh toán thất bại, mã lỗi:", responseCode);

    // Chuyển hướng về trang lỗi sau 3 giây
    setTimeout(() => {
      navigate("/order-failure");
    }, 3000);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      {loading ? (
        <div>
          <Spin size="large" />
          <p style={{ marginTop: "20px" }}>
            Đang xử lý thanh toán, vui lòng chờ...
          </p>
        </div>
      ) : paymentSuccess ? (
        <div>
          <h2 style={{ color: "#52c41a" }}>Thanh toán thành công!</h2>
          <p>Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.</p>
          <p>Chuyển hướng về trang chủ sau vài giây...</p>
        </div>
      ) : (
        <div>
          <h2 style={{ color: "#ff4d4f" }}>Thanh toán thất bại!</h2>
          <p>
            {errorMessage ||
              "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại."}
          </p>
          <p>Chuyển hướng về trang lỗi sau vài giây...</p>
        </div>
      )}
    </div>
  );
}

export default PaymentCallback;
