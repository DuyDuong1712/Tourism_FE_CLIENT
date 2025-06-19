import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { post } from "../../utils/axios-http/axios-http";

function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', 'pending'
  const [errorMessage, setErrorMessage] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Lấy tham số từ URL
        const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
        const bookingId = searchParams
          .get("vnp_OrderInfo")
          ?.replace("Thanh toan don hang:", "")
          .trim();
        const transactionNo = searchParams.get("vnp_TransactionNo");
        const amount = searchParams.get("vnp_Amount");
        const bankCode = searchParams.get("vnp_BankCode");

        // Validate các tham số bắt buộc
        if (!vnp_ResponseCode || !bookingId) {
          throw new Error("Thông tin thanh toán không hợp lệ");
        }

        setOrderInfo({
          bookingId,
          transactionNo,
          amount: amount ? parseInt(amount) / 100 : 0,
          bankCode,
        });

        if (vnp_ResponseCode === "00") {
          // Thanh toán thành công
          await handlePaymentSuccess(bookingId, transactionNo, amount);
          setPaymentStatus("success");
          message.success("Thanh toán thành công!");
        } else {
          // Thanh toán thất bại
          handlePaymentFailure(vnp_ResponseCode);
          setPaymentStatus("failed");
        }
      } catch (error) {
        console.error("Lỗi xử lý thanh toán:", error);
        setPaymentStatus("failed");
        setErrorMessage(error.message || "Đã xảy ra lỗi khi xử lý thanh toán");
        message.error(error.message || "Đã xảy ra lỗi khi xử lý thanh toán");
      } finally {
        setLoading(false);
      }
    };

    processPaymentCallback();
  }, [searchParams]);

  const handlePaymentSuccess = async (bookingId, transactionNo, amount) => {
    try {
      // Gọi API cập nhật trạng thái booking
      const response = await post("bookings/update-payment-status", {
        bookingId,
        status: "SUCCESS",
        transactionNo,
        amount: amount ? parseInt(amount) / 100 : 0, // VNPay trả về số tiền nhân 100
        paymentMethod: "VNPAY",
      });

      if (!response.data) {
        throw new Error("Cập nhật trạng thái thanh toán thất bại");
      }

      // Chuyển hướng sau 3 giây
      setTimeout(() => {
        navigate(`/order-success/${bookingId}`, {
          state: {
            bookingId,
            transactionNo,
            amount: amount ? parseInt(amount) / 100 : 0,
          },
        });
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái booking:", error);
      throw error;
    }
  };

  const handlePaymentFailure = async (responseCode) => {
    let errorMsg = "Thanh toán thất bại";

    // Xử lý các mã lỗi cụ thể từ VNPay
    const errorMap = {
      "07": "Giao dịch bị nghi ngờ gian lận",
      "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking",
      10: "Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
      11: "Đã hết hạn chờ thanh toán. Xin quý khách thực hiện lại giao dịch",
      12: "Thẻ/Tài khoản bị khóa",
      13: "Sai mã xác thực (OTP)",
      24: "Khách hàng hủy giao dịch",
      51: "Tài khoản không đủ số dư",
      65: "Tài khoản đã vượt quá hạn mức giao dịch trong ngày",
      75: "Ngân hàng thanh toán đang bảo trì",
      79: "Khách hàng nhập sai mật khẩu thanh toán quá số lần quy định",
      99: "Các lỗi khác",
    };

    try {
      if (orderInfo?.bookingId) {
        // Gửi trạng thái thất bại về backend
        await post("bookings/update-payment-status", {
          bookingId: orderInfo.bookingId,
          status: "FAILED",
          transactionNo: orderInfo.transactionNo || null,
          amount: orderInfo.amount || 0,
          paymentMethod: "VNPAY",
          errorCode: responseCode,
          errorMessage: errorMsg,
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thất bại:", error);
    }

    // Chuyển hướng sau 3 giây
    setTimeout(() => {
      navigate(`/`, {
        state: {
          errorCode: responseCode,
          errorMessage: errorMsg,
          ...(orderInfo || {}),
        },
      });
    }, 3000);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div>
          <Spin size="large" />
          <p style={{ marginTop: "20px" }}>Đang xử lý kết quả thanh toán...</p>
        </div>
      );
    }

    if (paymentStatus === "success") {
      return (
        <div>
          <h2 style={{ color: "#52c41a" }}>Thanh toán thành công!</h2>
          <p>Mã đơn hàng: {orderInfo?.bookingId}</p>
          <p>Số tiền: {orderInfo?.amount?.toLocaleString()} VND</p>
          <p>Bạn sẽ được chuyển hướng về trang xác nhận...</p>
        </div>
      );
    }

    return (
      <div>
        <h2 style={{ color: "#ff4d4f" }}>Thanh toán không thành công</h2>
        <p>{errorMessage}</p>
        <p>Bạn sẽ được chuyển hướng về trang thông báo lỗi...</p>
        <button
          onClick={() => navigate("/")}
          style={{ marginTop: 20, padding: "8px 16px" }}
        >
          Về trang chủ
        </button>
      </div>
    );
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "50px auto",
        padding: 20,
        textAlign: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {renderContent()}
    </div>
  );
}

export default PaymentCallback;
