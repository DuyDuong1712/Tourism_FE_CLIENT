import React, { useEffect, useState } from "react";
import "./style.scss";
import { useLocation, useNavigate } from "react-router-dom";
import Map from "../../assets/images/map.png";
import Eat from "../../assets/images/eat.png";
import Friend from "../../assets/images/friend.png";
import Oto from "../../assets/images/oto.png";
import Sale from "../../assets/images/sale.png";
import Vitri from "../../assets/images/vitri.png";
import Calendar from "../../assets/images/celanda.png";
import Time2 from "../../assets/images/time.png";
import Concho from "../../assets/images/concho.png";
import { getUser, post } from "../../utils/axios-http/axios-http";
import { message, Input, InputNumber, Select, DatePicker, Switch } from "antd";
import { format, parseISO } from "date-fns";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";

const PriceDisplay = ({ label, price, discount }) => (
  <div className="input-border">
    <label>{label}:</label>
    <p>
      {price === 0 ? (
        <div className="price">
          <p>0 đ</p>
        </div>
      ) : discount > 0 ? (
        <>
          <div className="price-discount">
            <p>
              <sub style={{ textDecoration: "line-through" }}>
                {price.toLocaleString("vi-VN")} đ
              </sub>
            </p>
          </div>
          <div className="price">
            <p>
              {(price - (price * discount) / 100).toLocaleString("vi-VN")} đ
            </p>
          </div>
        </>
      ) : (
        <div className="price">
          <p>{price ? price.toLocaleString("vi-VN") : "0"} đ</p>
        </div>
      )}
    </p>
  </div>
);

// Component để hiển thị thông tin hành khách
const PassengerForm = ({ index, type, passenger, onUpdate }) => {
  const handleSwitchChange = (checked) => {
    onUpdate(index, { ...passenger, singleRoomSupplement: checked });
  };

  return (
    <div className="passenger-form">
      <div>
        <div className="input-border">
          <label>
            Họ tên <span style={{ color: "red" }}>*</span>
          </label>
          <Input
            value={passenger.fullname}
            onChange={(e) =>
              onUpdate(index, { ...passenger, fullname: e.target.value })
            }
            placeholder="Nhập họ và tên"
            required
          />
        </div>
        <div className="input-border">
          <label>
            Ngày sinh <span style={{ color: "red" }}>*</span>
          </label>
          <DatePicker
            value={passenger.birthDate}
            onChange={(date) =>
              onUpdate(index, { ...passenger, birthDate: date })
            }
            placeholder="Chọn ngày sinh"
            format="DD-MM-YYYY"
            style={{ width: "100%" }}
          />
        </div>
        <div className="input-border">
          <label>
            Giới tính <span style={{ color: "red" }}>*</span>
          </label>
          <Select
            value={passenger.gender}
            onChange={(value) =>
              onUpdate(index, { ...passenger, gender: value })
            }
            placeholder="Chọn giới tính"
            style={{ width: "100%" }}
          >
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
            <Select.Option value="other">Khác</Select.Option>
          </Select>
        </div>
        {type === "Người lớn" && (
          <div className="input-border">
            <label>
              <span style={{ marginRight: "1rem" }}>Phụ thu phòng đơn</span>
              <Switch
                checked={passenger.singleRoomSupplement}
                onChange={handleSwitchChange}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

const calculateTotalPrice = (
  selectedTourDetail,
  adultQuantity,
  childrenQuantity,
  childQuantity,
  babyQuantity,
  adults
) => {
  const adultPrice = selectedTourDetail?.adultPrice || 0;
  const childrenPrice = selectedTourDetail?.childrenPrice || 0;
  const smallChildrenPrice = selectedTourDetail?.childPrice || 0;
  const babyPrice = selectedTourDetail?.babyPrice || 0;
  const singleRoomPrice = selectedTourDetail?.singleRoomSupplementPrice || 0;
  const discount = selectedTourDetail?.discount || 0;

  let total = 0;

  // Tính giá cho tất cả người lớn (giá cơ bản)
  total += adultQuantity * adultPrice;

  // Thêm phụ thu phòng đơn cho những người lớn chọn phòng đơn
  const singleRoomAdults = adults.filter(
    (adult) => adult.singleRoomSupplement
  ).length;
  total += singleRoomAdults * singleRoomPrice;

  // Tính giá cho các loại hành khách khác
  total += childrenQuantity * childrenPrice;
  total += childQuantity * smallChildrenPrice;
  total += babyQuantity * babyPrice;

  // Áp dụng giảm giá nếu có
  if (discount > 0) {
    total = total - (total * discount) / 100;
  }

  return total;
};

function Order1() {
  const location = useLocation();
  const tourDetails = location.state?.tourDetails;
  const selectedTourDetail = location.state?.selectedTourDetail;
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [userTT, setUserTT] = useState({});
  const [adultQuantity, setAdultQuantity] = useState(1);
  const [childrenQuantity, setChildrenQuantity] = useState(0);
  const [childQuantity, setChildQuantity] = useState(0);
  const [babyQuantity, setBabyQuantity] = useState(0);
  const [singleRoomQuantity, setSingleRoomQuantity] = useState(0);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const remainingSlots = selectedTourDetail?.remainingSlots || 0;

  // State để lưu thông tin hành khách
  const [adults, setAdults] = useState([
    { fullname: "", birthDate: null, gender: "", singleRoomSupplement: false },
  ]);
  const [children, setChildren] = useState([]);
  const [smallChildren, setSmallChildren] = useState([]);
  const [babies, setBabies] = useState([]);

  // State để lưu tổng tiền
  const [totalPrice, setTotalPrice] = useState(0);

  // Tính tổng số hành khách
  const totalPassengers =
    adultQuantity + childrenQuantity + childQuantity + babyQuantity;

  // Cập nhật danh sách hành khách khi số lượng thay đổi
  useEffect(() => {
    setAdults((prev) =>
      Array(adultQuantity)
        .fill()
        .map(
          (_, i) =>
            prev[i] || {
              fullname: "",
              birthDate: null,
              gender: "",
              singleRoomSupplement: false,
            }
        )
    );
  }, [adultQuantity]);

  useEffect(() => {
    setChildren((prev) =>
      Array(childrenQuantity)
        .fill()
        .map((_, i) => prev[i] || { fullname: "", birthDate: null, gender: "" })
    );
  }, [childrenQuantity]);

  useEffect(() => {
    setSmallChildren((prev) =>
      Array(childQuantity)
        .fill()
        .map((_, i) => prev[i] || { fullname: "", birthDate: null, gender: "" })
    );
  }, [childQuantity]);

  useEffect(() => {
    setBabies((prev) =>
      Array(babyQuantity)
        .fill()
        .map((_, i) => prev[i] || { fullname: "", birthDate: null, gender: "" })
    );
  }, [babyQuantity]);

  // Cập nhật tổng tiền khi có thay đổi
  useEffect(() => {
    const total = calculateTotalPrice(
      selectedTourDetail,
      adultQuantity,
      childrenQuantity,
      childQuantity,
      babyQuantity,
      adults
    );
    setTotalPrice(total);
  }, [
    selectedTourDetail,
    adultQuantity,
    childrenQuantity,
    childQuantity,
    babyQuantity,
    adults,
  ]);

  // Hàm cập nhật thông tin hành khách
  const updatePassenger = (type, index, data) => {
    const updatedData = {
      ...data,
      birthDate: data.birthDate ? data.birthDate.format("YYYY-MM-DD") : null,
    };

    if (type === "Người lớn") {
      setAdults((prev) => {
        const newAdults = [...prev];
        newAdults[index] = updatedData;
        return newAdults;
      });
    } else if (type === "Trẻ em") {
      setChildren((prev) => {
        const newChildren = [...prev];
        newChildren[index] = updatedData;
        return newChildren;
      });
    } else if (type === "Trẻ nhỏ") {
      setSmallChildren((prev) => {
        const newSmallChildren = [...prev];
        newSmallChildren[index] = updatedData;
        return newSmallChildren;
      });
    } else if (type === "Em bé") {
      setBabies((prev) => {
        const newBabies = [...prev];
        newBabies[index] = updatedData;
        return newBabies;
      });
    }
  };

  // Đồng bộ userTT với user.user khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUser("users/profile");
        setUser(response.data);
        if (response?.data) {
          setUserTT({
            fullname: response.data.fullname || "",
            phone: response.data.phone || "",
            email: response.data.email || "",
            address: response.data.address || "",
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    fetchData();
  }, []);

  // Hàm kiểm tra tổng số hành khách
  const checkTotalPassengers = (newAdult, newChildren, newChild, newBaby) => {
    const totalPassengers = newAdult + newChildren + newChild + newBaby;
    if (totalPassengers > remainingSlots) {
      message.error(
        `Tổng số hành khách (${totalPassengers}) vượt quá số chỗ còn lại (${remainingSlots})!`
      );
      return false;
    }
    return true;
  };

  // Cập nhật số lượng người lớn
  const handleAdultQuantityChange = (value) => {
    const newValue = Number(value) || 1;
    if (
      checkTotalPassengers(
        newValue,
        childrenQuantity,
        childQuantity,
        babyQuantity
      )
    ) {
      setAdultQuantity(newValue);
    }
  };

  // Cập nhật số lượng trẻ em
  const handleChildrenQuantityChange = (value) => {
    const newValue = Number(value) || 0;
    if (
      checkTotalPassengers(adultQuantity, newValue, childQuantity, babyQuantity)
    ) {
      setChildrenQuantity(newValue);
    }
  };

  // Cập nhật số lượng trẻ nhỏ
  const handleChildQuantityChange = (value) => {
    const newValue = Number(value) || 0;
    if (
      checkTotalPassengers(
        adultQuantity,
        childrenQuantity,
        newValue,
        babyQuantity
      )
    ) {
      setChildQuantity(newValue);
    }
  };

  // Cập nhật số lượng em bé
  const handleBabyQuantityChange = (value) => {
    const newValue = Number(value) || 0;
    if (
      checkTotalPassengers(
        adultQuantity,
        childrenQuantity,
        childQuantity,
        newValue
      )
    ) {
      setBabyQuantity(newValue);
    }
  };

  const handleOrder = async () => {
    if (totalPassengers > remainingSlots) {
      message.error(
        `Tổng số hành khách (${totalPassengers}) vượt quá số chỗ còn lại (${remainingSlots})!`
      );
      return;
    }

    // Kiểm tra thông tin liên lạc
    if (!userTT.fullname || !userTT.phone || !userTT.email || !userTT.address) {
      message.error("Vui lòng điền đầy đủ thông tin liên lạc!");
      return;
    }

    // Kiểm tra thông tin hành khách
    const allPassengersValid = [
      ...adults,
      ...children,
      ...smallChildren,
      ...babies,
    ].every((p) => p.fullName && p.birthDate && p.gender);

    if (!allPassengersValid) {
      message.error("Vui lòng điền đầy đủ thông tin hành khách!");
      return;
    }

    const orderData = {
      fullname: userTT.fullname,
      email: userTT.email,
      phone: userTT.phone,
      address: userTT.address,
      adultPrice: selectedTourDetail?.adultPrice || 0,
      adultQuantity,
      childrenPrice: selectedTourDetail?.childrenPrice || 0,
      childrenQuantity,
      childPrice: selectedTourDetail?.childPrice || 0,
      childQuantity,
      babyPrice: selectedTourDetail?.babyPrice || 0,
      babyQuantity,
      singleRoomSupplementPrice:
        selectedTourDetail?.singleRoomSupplementPrice || 0,
      singleRoomSupplementQuantity: singleRoomQuantity,
      note,
      paymentMethod,
      tourDetailId: selectedTourDetail?.id,
      userId: user?.id,
    };
    console.log(orderData, "orderData");

    try {
      const response = await post("orders/book-tour", orderData);
      if (response) {
        message.success("Đặt tour thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi đặt tour:", error);
      message.error("Đặt tour thất bại! Vui lòng thử lại");
    }
  };

  // Tính toán max value cho từng loại hành khách
  const getMaxValue = (currentValue, otherValues) => {
    const otherTotal = otherValues.reduce((sum, val) => sum + val, 0);
    return remainingSlots - otherTotal + currentValue;
  };

  console.log("selectedTourDetail", selectedTourDetail);

  return (
    <div className="order">
      <div className="order-header">
        <div className="order-header-content">
          <button
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/tour-details/${tourDetails?.tour?.slug}`)}
          >
            <i className="fa-solid fa-arrow-left"></i> <span>Quay lại</span>
          </button>
          <h1>Đặt tour</h1>
        </div>
      </div>
      <div className="page-order">
        <div className="page-order-container">
          <div className="page-order-left">
            <div className="order-contact">
              <h3>Giá</h3>
              <div className="price-grid">
                <div className="price-left">
                  <PriceDisplay
                    label="Người lớn"
                    price={selectedTourDetail?.adultPrice}
                    discount={selectedTourDetail?.discount || 0}
                  />
                  <PriceDisplay
                    label="Trẻ em"
                    price={selectedTourDetail?.childrenPrice}
                    discount={selectedTourDetail?.discount || 0}
                  />
                  <PriceDisplay
                    label="Trẻ nhỏ"
                    price={selectedTourDetail?.childPrice}
                    discount={selectedTourDetail?.discount || 0}
                  />
                </div>
                <div className="price-right">
                  <PriceDisplay
                    label="Em bé"
                    price={selectedTourDetail?.babyPrice}
                    discount={selectedTourDetail?.discount || 0}
                  />
                  <PriceDisplay
                    label="Phụ thu phòng đơn"
                    price={selectedTourDetail?.singleRoomSupplementPrice}
                    discount={selectedTourDetail?.discount || 0}
                  />
                </div>
              </div>
            </div>
            <div className="order-contact">
              <h3>Thông tin liên lạc</h3>
              <form>
                <div className="booking-contact-row">
                  <div className="linee-r">
                    <div className="input-border">
                      <label>
                        Họ tên <span style={{ color: "red" }}>*</span>
                      </label>
                      <Input
                        value={userTT.fullname}
                        onChange={(e) =>
                          setUserTT({ ...userTT, fullname: e.target.value })
                        }
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-border">
                      <label>
                        Điện thoại <span style={{ color: "red" }}>*</span>
                      </label>
                      <Input
                        value={userTT.phone}
                        onChange={(e) =>
                          setUserTT({ ...userTT, phone: e.target.value })
                        }
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="booking-contact-row">
                  <div className="linee-r">
                    <div className="input-border">
                      <label>
                        Email <span style={{ color: "red" }}>*</span>
                      </label>
                      <Input
                        value={userTT.email}
                        onChange={(e) =>
                          setUserTT({ ...userTT, email: e.target.value })
                        }
                        placeholder="Nhập email"
                        required
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-border">
                      <label>
                        Địa chỉ <span style={{ color: "red" }}>*</span>
                      </label>
                      <Input
                        value={userTT.address}
                        onChange={(e) =>
                          setUserTT({ ...userTT, address: e.target.value })
                        }
                        placeholder="Nhập địa chỉ"
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="order-item">
              <h3>Hành khách</h3>
              <div className="booking-wrapper">
                <div className="input">
                  <div className="booking-form">
                    <div className="false">
                      <div className="wrapper">
                        <div className="row">
                          <div className="type">
                            <p>Người lớn</p>
                            <small>Từ 12 trở lên</small>
                          </div>
                          <div className="quantity">
                            <InputNumber
                              min={1}
                              defaultValue={1}
                              max={getMaxValue(adultQuantity, [
                                childrenQuantity,
                                childQuantity,
                                babyQuantity,
                              ])}
                              onChange={handleAdultQuantityChange}
                              controls={{
                                upIcon:
                                  totalPassengers >= remainingSlots
                                    ? null
                                    : undefined,
                                downIcon: adultQuantity > 1 ? undefined : null,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="false">
                      <div className="wrapper">
                        <div className="row">
                          <div className="type">
                            <p>Trẻ em</p>
                            <small>Từ 5 - 11 tuổi</small>
                          </div>
                          <div className="quantity">
                            <InputNumber
                              min={0}
                              defaultValue={0}
                              max={getMaxValue(childrenQuantity, [
                                adultQuantity,
                                childQuantity,
                                babyQuantity,
                              ])}
                              onChange={handleChildrenQuantityChange}
                              controls={{
                                upIcon:
                                  totalPassengers >= remainingSlots
                                    ? null
                                    : undefined,
                                downIcon:
                                  childrenQuantity > 0 ? undefined : null,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="booking-form">
                    <div className="false">
                      <div className="wrapper">
                        <div className="row">
                          <div className="type">
                            <p>Trẻ nhỏ</p>
                            <small>Từ 2 - 4 tuổi</small>
                          </div>
                          <div className="quantity">
                            <InputNumber
                              min={0}
                              defaultValue={0}
                              max={getMaxValue(childQuantity, [
                                adultQuantity,
                                childrenQuantity,
                                babyQuantity,
                              ])}
                              onChange={handleChildQuantityChange}
                              controls={{
                                upIcon:
                                  totalPassengers >= remainingSlots
                                    ? null
                                    : undefined,
                                downIcon: childQuantity > 0 ? undefined : null,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="false">
                      <div className="wrapper">
                        <div className="row">
                          <div className="type">
                            <p>Em bé</p>
                            <small>Dưới 2 tuổi</small>
                          </div>
                          <div className="quantity">
                            <InputNumber
                              min={0}
                              defaultValue={0}
                              max={getMaxValue(babyQuantity, [adultQuantity, childrenQuantity, childQuantity])}
                              onChange={handleBabyQuantityChange}
                              controls={{
                                upIcon:
                                  totalPassengers >= remainingSlots
                                    ? null
                                    : undefined,
                                downIcon: babyQuantity > 0 ? undefined : null,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-pax-info--list">
              {adults.length > 0 && (
                <>
                  <div className="booking-info-divider"></div>
                  <div className="item booking-info-adults">
                    <div className="item-title">
                      Người lớn <span>(Từ 12 trở lên)</span>
                    </div>
                    <div className="item-content">
                      <ul style={{ listStyle: "none" }}>
                        {adults.map((adult, index) => (
                          <li key={index} style={{ marginBottom: "1rem" }}>
                            <PassengerForm
                              key={index}
                              index={index}
                              type="Người lớn"
                              passenger={adult}
                              onUpdate={(index, data) =>
                                updatePassenger("Người lớn", index, data)
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {children.length > 0 && (
                <>
                  <div className="booking-info-divider"></div>
                  <div className="item booking-info-adults">
                    <div className="item-title">
                      Trẻ em <span>(Từ 5 - 11 tuổi)</span>
                    </div>
                    <div className="item-content">
                      <ul style={{ listStyle: "none" }}>
                        {children.map((child, index) => (
                          <li key={index} style={{ marginBottom: "1rem" }}>
                            <PassengerForm
                              key={index}
                              index={index}
                              type="Trẻ em"
                              passenger={child}
                              onUpdate={(index, data) =>
                                updatePassenger("Trẻ em", index, data)
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {smallChildren.length > 0 && (
                <>
                  <div className="booking-info-divider"></div>
                  <div className="item booking-info-adults">
                    <div className="item-title">
                      Trẻ nhỏ <span>(Từ 2 - 5 tuổi)</span>
                    </div>
                    <div className="item-content">
                      <ul style={{ listStyle: "none" }}>
                        {smallChildren.map((child, index) => (
                          <li key={index} style={{ marginBottom: "1rem" }}>
                            <PassengerForm
                              key={index}
                              index={index}
                              type="Trẻ nhỏ"
                              passenger={child}
                              onUpdate={(index, data) =>
                                updatePassenger("Trẻ nhỏ", index, data)
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {babies.length > 0 && (
                <>
                  <div className="booking-info-divider"></div>
                  <div className="item booking-info-adults">
                    <div className="item-title">
                      Em bé <span>(Dưới 2 tuổi)</span>
                    </div>
                    <div className="item-content">
                      <ul style={{ listStyle: "none" }}>
                        {babies.map((baby, index) => (
                          <li key={index} style={{ marginBottom: "1rem" }}>
                            <PassengerForm
                              key={index}
                              index={index}
                              type="Em bé"
                              passenger={baby}
                              onUpdate={(index, data) =>
                                updatePassenger("Em bé", index, data)
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="order-note">
              <h3 style={{ marginBottom: "1rem" }}>GHI CHÚ</h3>
              <div style={{ marginBottom: "1rem" }}>
                Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi
              </div>
              <div className="booking-note">
                <TextArea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Vui lòng nhập nội dung"
                  autoSize={{ minRows: 4, maxRows: 7 }}
                  style={{ width: "100%", backgroundColor: "#f5f5f5" }}
                />
              </div>
            </div>

            {/* <div className="booking-item">
              <h3>Các hình thức thanh toán</h3>
              <input
                type="text"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div> */}
          </div>

          <div className="page-order-right">
            <div className="sumary">
              <h3>Tóm tắt chuyến đi</h3>
              <div className="card">
                <div className="card-header">
                  <div className="image">
                    <img src={tourDetails?.tourImages[0]?.imageUrl} alt="" />
                  </div>
                  <div className="title-booking">
                    <div className="row">
                      <h4>{tourDetails?.title}</h4>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="preview">
                  <div className="row">
                    <img src={Vitri} alt="" />
                    <span>Khởi hành: </span>
                    <span>{tourDetails?.departure}</span>
                  </div>
                  <div className="row">
                    <img src={Time2} alt="" />
                    Thời gian:{" "}
                    <span>
                      {selectedTourDetail?.duration !== undefined
                        ? selectedTourDetail.duration === 0
                          ? "1N"
                          : `${selectedTourDetail.duration}N${
                              selectedTourDetail.duration - 1
                            }Đ`
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="preview">
                  <div className="row">
                    <img src={Calendar} alt="" />
                    <span>Ngày khởi hành: </span>
                    <span>
                      {format(
                        parseISO(selectedTourDetail.dayStart),
                        "dd-MM-yyyy"
                      )}
                    </span>
                  </div>
                  <div className="row">
                    <img src={Calendar} alt="" />
                    <span>Ngày trở về: </span>
                    <span>
                      {format(
                        parseISO(selectedTourDetail.dayReturn),
                        "dd-MM-yyyy"
                      )}
                    </span>
                  </div>
                </div>
                <hr />
                <div className="card-footer">
                  <div className="totalPrice">
                    <div className="left">Tổng tiền</div>
                    <div className="right">
                      {totalPrice.toLocaleString("vi-VN")}
                    </div>
                  </div>
                  <button onClick={handleOrder}>Đặt tour</button>
                </div>
              </div>
              <div className="tour-contact">
                <div className="tour-contact-group">
                  <button
                    className="btn-phone"
                    onClick={() => (window.location.href = "tel:+84824783053")}
                    aria-label="Gọi tư vấn miễn phí"
                  >
                    <i className="fa-solid fa-phone-volume"></i>
                    <p>Gọi miễn phí qua internet</p>
                  </button>
                  <button
                    className="btn-mail"
                    onClick={() =>
                      (window.location.href =
                        "mailto:duyduongtourism@gmail.com")
                    }
                    aria-label="Gửi email tư vấn"
                  >
                    <i className="fa-regular fa-envelope"></i>
                    <p>Liên hệ tư vấn</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order1;
