import React, { useState } from "react";
import { message } from "antd";
import { patchUser } from "../../utils/axios-http/axios-http";
import { useNavigate } from "react-router-dom";

function DeleteUser() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      const response = await patchUser("user/delete");
      message.success(response.data);
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (error) {
      message.error(error.response?.data || "Đã xảy ra lỗi khi xóa tài khoản!");
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <div className="delete-user">
      <h2>Xóa Tài Khoản</h2>
      <p>
        Bạn chắc chắn muốn xóa tài khoản của mình? Quá trình này không thể hoàn
        tác.
      </p>
      <button
        onClick={handleDeleteAccount}
        disabled={loading}
        className="delete-btn"
      >
        {loading ? "Đang xử lý..." : "Xóa tài khoản"}
      </button>
    </div>
  );
}

export default DeleteUser;
