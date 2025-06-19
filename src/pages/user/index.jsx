import "./style.scss";
import { useState, useEffect, useRef, React } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";
import { message, Select } from "antd";
import { getUser, patch, patchUser } from "../../utils/axios-http/axios-http";

function User() {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [isEditingDateOfBirth, setIsEditingDateOfBirth] = useState(false);
  const [isEditingIdCard, setIsEditingIdCard] = useState(false);
  const [isEditingPassport, setIsEditingPassport] = useState(false);
  const [isEditingCountry, setIsEditingCountry] = useState(false);

  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idCard, setIdCard] = useState("");
  const [passport, setPassport] = useState("");
  const [country, setCountry] = useState("");

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
      // Validation
      if (isEditingPhone && phone && !/^\d{10}$/.test(phone)) {
        message.error("Số điện thoại phải có 10 chữ số");
        return;
      }
      if (isEditingIdCard && idCard && !/^\d{12}$/.test(idCard)) {
        message.error("CMND/CCCD phải có 12 chữ số");
        return;
      }
      if (isEditingPassport && passport && !/^[A-Z0-9]{8}$/.test(passport)) {
        message.error("Hộ chiếu phải có 8 ký tự chữ cái hoặc số");
        return;
      }
      if (isEditingGender && gender && !["NAM", "NỮ"].includes(gender)) {
        message.error("Giới tính phải là 'Nam' hoặc 'Nữ'");
        return;
      }

      const data = {};
      if (isEditingName && name) data.fullName = name;
      if (isEditingPhone && phone) data.phoneNumber = phone;
      if (isEditingAddress && address) data.address = address;
      if (isEditingGender && gender) data.gender = gender;
      if (isEditingDateOfBirth && dateOfBirth) data.date_of_birth = dateOfBirth;
      if (isEditingIdCard && idCard) data.id_card = idCard;
      if (isEditingPassport && passport) data.passport = passport;
      if (isEditingCountry && country) data.country = country;

      await patchUser(`users`, data);
      message.success("Cập nhật thông tin thành công!");

      setIsEditingName(false);
      setIsEditingPhone(false);
      setIsEditingAddress(false);
      setIsEditingGender(false);
      setIsEditingDateOfBirth(false);
      setIsEditingIdCard(false);
      setIsEditingPassport(false);
      setIsEditingCountry(false);
    } catch (error) {
      console.log(error);
      message.error("Cập nhật thông tin thất bại!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUser("users/profile");
        const userData = response.data || {};
        setUser(userData);
        setName(userData.fullname || "");
        setPhone(userData.phone || "");
        setAddress(userData.address || "");
        setGender(userData.gender || "");
        setDateOfBirth(userData.date_of_birth || "");
        setIdCard(userData.id_card || "");
        setPassport(userData.passport || "");
        setCountry(userData.country || "");
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        message.error("Không thể tải thông tin người dùng");
      }
    };
    fetchData();
  }, []);

  console.log(user);

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
                    <div className="user-id">{user?.fullname}</div>
                    <div className="user-email">{user?.email}</div>
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
                  <button
                    className="active-sidebar"
                    onClick={() => {
                      navigate("/user/user-order");
                    }}
                  >
                    <i className="fa-solid fa-list"></i> Đơn đặt tour
                  </button>
                </div>
                <div className="user-list">
                  <button
                    className="active-sidebar"
                    onClick={() => {
                      navigate("/user/favorite-tour");
                    }}
                  >
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
                      <div className="right">{user?.email}</div>
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

                    <div className="item">
                      <div className="left">Giới tính</div>
                      <div className="right">
                        {!isEditingGender ? (
                          <div className="info-form">
                            {gender}
                            <button>
                              <i
                                className="fa-solid fa-pen"
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsEditingGender(true)}
                              ></i>
                            </button>
                          </div>
                        ) : (
                          <div className="edit-form">
                            <Select
                              placeholder="Chọn giới tính"
                              options={[
                                { value: "NAM", label: "Nam" },
                                { value: "NỮ", label: "Nữ" },
                              ]}
                              onChange={(value) => setGender(value)}
                            />
                            <div className="btn-group">
                              <button
                                className="btn-cancel"
                                onClick={() => setIsEditingGender(false)}
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

                    <div className="item">
                      <div className="left">Ngày sinh</div>
                      <div className="right">
                        {!isEditingDateOfBirth ? (
                          <div className="info-form">
                            {dateOfBirth}
                            <button>
                              <i
                                className="fa-solid fa-pen"
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsEditingDateOfBirth(true)}
                              ></i>
                            </button>
                          </div>
                        ) : (
                          <div className="edit-form">
                            <input
                              type="date"
                              value={dateOfBirth}
                              onChange={(e) => setDateOfBirth(e.target.value)}
                            />
                            <div className="btn-group">
                              <button
                                className="btn-cancel"
                                onClick={() => setIsEditingDateOfBirth(false)}
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

                    <div className="item">
                      <div className="left">CMND/CCCD</div>
                      <div className="right">
                        {!isEditingIdCard ? (
                          <div className="info-form">
                            {idCard}
                            <button>
                              <i
                                className="fa-solid fa-pen"
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsEditingIdCard(true)}
                              ></i>
                            </button>
                          </div>
                        ) : (
                          <div className="edit-form">
                            <input
                              type="text"
                              placeholder="Nhập số CMND/CCCD"
                              value={idCard}
                              onChange={(e) => setIdCard(e.target.value)}
                            />
                            <div className="btn-group">
                              <button
                                className="btn-cancel"
                                onClick={() => setIsEditingIdCard(false)}
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

                    <div className="item">
                      <div className="left">Hộ chiếu</div>
                      <div className="right">
                        {!isEditingPassport ? (
                          <div className="info-form">
                            {passport}
                            <button>
                              <i
                                className="fa-solid fa-pen"
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsEditingPassport(true)}
                              ></i>
                            </button>
                          </div>
                        ) : (
                          <div className="edit-form">
                            <input
                              type="text"
                              placeholder="Nhập số hộ chiếu"
                              value={passport}
                              onChange={(e) => setPassport(e.target.value)}
                            />
                            <div className="btn-group">
                              <button
                                className="btn-cancel"
                                onClick={() => setIsEditingPassport(false)}
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

                    <div className="item">
                      <div className="left">Quốc tịch</div>
                      <div className="right">
                        {!isEditingCountry ? (
                          <div className="info-form">
                            {country}
                            <button>
                              <i
                                className="fa-solid fa-pen"
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsEditingCountry(true)}
                              ></i>
                            </button>
                          </div>
                        ) : (
                          <div className="edit-form">
                            <input
                              type="text"
                              placeholder="Nhập quốc tịch"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                            />
                            <div className="btn-group">
                              <button
                                className="btn-cancel"
                                onClick={() => setIsEditingCountry(false)}
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
