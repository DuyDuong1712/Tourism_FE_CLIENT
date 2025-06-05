import React from "react";
import "./style.scss";
import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";
import { message } from "antd";
import { getUser, patch, patchUser } from "../../utils/axios-http/axios-http";

function User() {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      message.success("Đã đăng xuất");
      navigate("/login");
    } catch (error) {
      console.log(error);
      message.error("Đăng xuất thất bại");
    }
  };

  const handleEditUser = async () => {
    try {
      const data = {
        fullName: name,
        phoneNumber: phone,
        address: address,
      };
      await patchUser(`user/update`, data);
      message.success("Cập nhật thông tin thành công!");
      setIsEditingName(false);
      setIsEditingPhone(false);
      setIsEditingAddress(false);
    } catch (error) {
      console.log(error);
      message.error("Cập nhật thông tin thất bại!");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await getUser("user/profile");
      setUser(response);
      setName(response.user.fullName);
      setPhone(response.user.phoneNumber);
      setAddress(response.user.address);
    };
    fetchData();
  }, []);

  return (
    <div className="user">
      <div className="user-page">
        <div className="user-page-header">
          <div className="user-header-back">
            <button
              className="back-button"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <i className="fa-solid fa-arrow-left"></i> <span>Quay lại</span>
            </button>
          </div>
          <h1>Tài khoản của bạn</h1>
        </div>
        <div className="user-content">
          <div className="sidebar">
            <div className="user-left-sidebar">
              <div className="user-left-sidebar-top">
                <div className="row">
                  <img src="" alt="" />
                  <div className="info">
                    <div className="user-id">{user?.user?.fullName}</div>
                    <div className="user-email">{user?.user?.email}</div>
                  </div>
                </div>
              </div>
              <div className="user-left-sidebar-body">
                <div className="user-list">
                  <button className="active-sidebar">
                    <i className="fa-solid fa-user"></i> Tài khoản
                  </button>
                  <div className="dropdown-container">
                    <button className="active-sidebar">
                      Thông tin cá nhân
                    </button>
                    <button
                      className="active-sidebar"
                      onClick={() => {
                        navigate("/user/change-password");
                      }}
                    >
                      Đổi mật khẩu
                    </button>
                    <button className="active-sidebar" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                    <button
                      className="active-sidebar"
                      onClick={() => {
                        navigate("/user/delete-user");
                      }}
                    >
                      Yêu cầu xóa tài khoản
                    </button>
                  </div>
                </div>
                <div className="user-list">
                  <button className="active-sidebar">
                    <i className="fa-solid fa-heart"></i> Yêu thích đã lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="account-info">
              <div className="account-wrapper">
                <div className="account-right-info">
                  <div className="ac-top">
                    <h4>Thông tin cá nhân</h4>
                    <p>
                      Cập nhật thông tin của Quý khách và tìm hiểu các thông tin
                      này được sử dụng ra sao
                    </p>
                  </div>
                  <div className="ac-body">
                    <div className="item">
                      <div className="left">Họ tên</div>
                      <div className="right">
                        {!isEditingName ? (
                          <div className="info-form">
                            {name}
                            <button>
                              <i
                                className="fa-solid fa-pen"
                                onClick={() => setIsEditingName(true)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </button>
                          </div>
                        ) : (
                          <div className="edit-form">
                            <label htmlFor="">Họ tên</label>
                            <input
                              type="text"
                              placeholder="Nhập tên mới"
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value);
                              }}
                            />
                            <div className="btn-group">
                              <button
                                className="btn-cancel"
                                onClick={() => setIsEditingName(false)}
                                style={{ cursor: "pointer" }}
                              >
                                Hủy
                              </button>
                              <button
                                className="save"
                                onClick={() => {
                                  handleEditUser();
                                }}
                              >
                                Lưu
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="item">
                      <div className="left">Điện thoại</div>
                      <div className="right">
                        {!isEditingPhone ? (
                          <div className="info-form">
                            {phone}
                            <button>
                              <i
                                className="fa-solid fa-pen"
                                onClick={() => setIsEditingPhone(true)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            </button>
                          </div>
                        ) : (
                          <div className="edit-form">
                            <label htmlFor="">Điện thoại</label>
                            <input
                              type="text"
                              placeholder="Nhập số điện thoại"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                            <div className="btn-group">
                              <button
                                className="btn-cancel"
                                onClick={() => setIsEditingPhone(false)}
                              >
                                Hủy
                              </button>
                              <button
                                className="save"
                                onClick={() => {
                                  handleEditUser();
                                }}
                              >
                                Lưu
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="item">
                      <div className="left">Email</div>
                      <div className="right">{user?.user?.email}</div>
                    </div>
                    <div className="item">
                      <div className="left">Địa chỉ</div>
                      <div className="right">
                        {!isEditingAddress ? (
                          <div className="info-form">
                            {address}
                            <button>
                              <i
                                className="fa-solid fa-pen"
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsEditingAddress(true)}
                              ></i>
                            </button>
                          </div>
                        ) : (
                          <div className="edit-form">
                            <label htmlFor="">Địa chỉ: </label>
                            <input
                              type="text"
                              placeholder="Nhập địa chỉ"
                              value={address}
                              onChange={(e) => {
                                setAddress(e.target.value);
                              }}
                            />
                            <div className="btn-group">
                              <button
                                className="btn-cancel"
                                onClick={() => setIsEditingAddress(false)}
                              >
                                Hủy
                              </button>
                              <button
                                className="save"
                                onClick={() => handleEditUser()}
                              >
                                Lưu
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
