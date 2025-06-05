import React, { useState } from "react";
import { message, Input, Button } from "antd";
import { patchUser } from "../../utils/axios-http/axios-http";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      message.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      message.error("Xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);

    try {
      const response = await patchUser("user/change-password", {
        oldPassword,
        newPassword,
        confirmNewPassword,
      });

      message.success("Đổi mật khẩu thành công!");
      navigate("/user");
    } catch (error) {
      message.error(
        error.response?.data || "Đã xảy ra lỗi khi thay đổi mật khẩu!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password">
      <h2>Đổi Mật Khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword">Mật khẩu cũ</label>
          <Input.Password
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Nhập mật khẩu cũ"
          />
        </div>
        <div>
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <Input.Password
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
          <Input.Password
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>
        <Button type="primary" htmlType="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Lưu"}
        </Button>
      </form>
    </div>
  );
}

export default ChangePassword;
