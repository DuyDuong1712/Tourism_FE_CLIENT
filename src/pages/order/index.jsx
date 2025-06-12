import React, { useEffect, useState } from "react";
import "./style.scss";
import { useLocation, useNavigate } from "react-router-dom";
import Vitri from "../../assets/images/vitri.png";
import Calendar from "../../assets/images/celanda.png";
import Time2 from "../../assets/images/time.png";
import Concho from "../../assets/images/concho.png";
import { getUser, post } from "../../utils/axios-http/axios-http";
import { message, Input, InputNumber, Select, DatePicker, Switch } from "antd";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";

const PriceDisplay = ({ label, price, discount }) => (
  <div className="input-border">
    <label>{label}:</label>
    <div>
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
    </div>
  </div>
);

const PassengerForm = ({ index, type, passenger, onUpdate }) => {
  const handleSwitchChange = (checked) => {
    onUpdate(index, { ...passenger, singleRoomSupplement: checked });
  };

  const birthDateValue = passenger.birthDate
    ? moment(passenger.birthDate, "YYYY-MM-DD", true).isValid()
      ? moment(passenger.birthDate, "YYYY-MM-DD")
      : null
    : null;

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
            value={birthDateValue}
            onChange={(date) =>
              onUpdate(index, {
                ...passenger,
                birthDate: date ? date.format("YYYY-MM-DD") : null,
              })
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
              <span style={{ marginRight: "1rem" }}>Phòng đơn</span>
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

  total += adultQuantity * adultPrice;
  total += childrenQuantity * childrenPrice;
  total += childQuantity * smallChildrenPrice;
  total += babyQuantity * babyPrice;

  const singleRoomAdults = adults.filter(
    (adult) => adult.singleRoomSupplement
  ).length;
  total += singleRoomAdults * singleRoomPrice;

  const originalPrice = total;
  const discountAmount = discount > 0 ? (total * discount) / 100 : 0;
  const finalPrice = total - discountAmount;

  return {
    originalPrice,
    discountAmount,
    finalPrice,
    singleRoomQuantity: singleRoomAdults,
  };
};

function Order() {
  const location = useLocation();
  const tourDetails = location.state?.tourDetails;
  const selectedTourDetail = location.state?.selectedTourDetail;
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [userTT, setUserTT] = useState({});
  const [adultQuantity, setAdultQuantity] = useState(1);
  const [childrenQuantity, setChildrenQuantity] = useState(0);
  const [childQuantity, setChildQuantity] = useState(0);
  const [babyQuantity, setBabyQuantity] = useState(0);
  const [singleRoomQuantity, setSingleRoomQuantity] = useState(0);
  const [note, setNote] = useState("");
  const [paymentMethod] = useState("VNPAY");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const remainingSlots = Math.max(0, selectedTourDetail?.remainingSlots || 0);

  const [adults, setAdults] = useState([
    { fullname: "", birthDate: null, gender: "", singleRoomSupplement: false },
  ]);
  const [children, setChildren] = useState([]);
  const [smallChildren, setSmallChildren] = useState([]);
  const [babies, setBabies] = useState([]);

  const totalPassengers =
    adultQuantity + childrenQuantity + childQuantity + babyQuantity;

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

  useEffect(() => {
    if (
      adults.length !== adultQuantity ||
      children.length !== childrenQuantity ||
      smallChildren.length !== childQuantity ||
      babies.length !== babyQuantity
    ) {
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
      setChildren((prev) =>
        Array(childrenQuantity)
          .fill()
          .map(
            (_, i) => prev[i] || { fullname: "", birthDate: null, gender: "" }
          )
      );
      setSmallChildren((prev) =>
        Array(childQuantity)
          .fill()
          .map(
            (_, i) => prev[i] || { fullname: "", birthDate: null, gender: "" }
          )
      );
      setBabies((prev) =>
        Array(babyQuantity)
          .fill()
          .map(
            (_, i) => prev[i] || { fullname: "", birthDate: null, gender: "" }
          )
      );
    }

    const { originalPrice, discountAmount, finalPrice, singleRoomQuantity } =
      calculateTotalPrice(
        selectedTourDetail,
        adultQuantity,
        childrenQuantity,
        childQuantity,
        babyQuantity,
        adults
      );
    setSingleRoomQuantity(singleRoomQuantity);
    setOriginalPrice(originalPrice);
    setDiscountAmount(discountAmount);
    setFinalPrice(finalPrice);
  }, [
    adultQuantity,
    childrenQuantity,
    childQuantity,
    babyQuantity,
    selectedTourDetail,
    adults,
  ]);

  const updatePassenger = (type, index, data) => {
    if (type === "Người lớn") {
      setAdults((prev) => {
        const newAdults = [...prev];
        newAdults[index] = { ...data };
        return newAdults;
      });
    } else if (type === "Trẻ em") {
      setChildren((prev) => {
        const newChildren = [...prev];
        newChildren[index] = { ...data };
        return newChildren;
      });
    } else if (type === "Trẻ nhỏ") {
      setSmallChildren((prev) => {
        const newSmallChildren = [...prev];
        newSmallChildren[index] = { ...data };
        return newSmallChildren;
      });
    } else if (type === "Em bé") {
      setBabies((prev) => {
        const newBabies = [...prev];
        newBabies[index] = { ...data };
        return newBabies;
      });
    }
  };

  const checkTotalPassengers = (newAdult, newChildren, newChild, newBaby) => {
    const total = newAdult + newChildren + newChild + newBaby;
    if (total > remainingSlots) {
      message.error(
        `Tổng số hành khách (${total}) vượt quá số chỗ còn lại (${remainingSlots})!`
      );
      return false;
    }
    return true;
  };

  const handleAdultQuantityChange = (value) => {
    const newValue = Math.max(1, Number(value) || 1);
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

  const handleChildrenQuantityChange = (value) => {
    const newValue = Math.max(0, Number(value) || 0);
    if (
      checkTotalPassengers(adultQuantity, newValue, childQuantity, babyQuantity)
    ) {
      setChildrenQuantity(newValue);
    }
  };

  const handleChildQuantityChange = (value) => {
    const newValue = Math.max(0, Number(value) || 0);
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

  const handleBabyQuantityChange = (value) => {
    const newValue = Math.max(0, Number(value) || 0);
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

  const getMaxValue = (currentValue, otherValues) => {
    const otherTotal = otherValues.reduce((sum, val) => sum + val, 0);
    return Math.max(0, remainingSlots - otherTotal);
  };

  const handleOrder = async () => {
    if (totalPassengers > remainingSlots) {
      message.error(
        `Tổng số hành khách (${totalPassengers}) vượt quá số chỗ còn lại (${remainingSlots})!`
      );
      return;
    }

    if (!userTT.fullname || !userTT.phone || !userTT.email || !userTT.address) {
      message.error("Vui lòng điền đầy đủ thông tin liên lạc!");
      return;
    }

    const allPassengersValid = [
      ...adults,
      ...children,
      ...smallChildren,
      ...babies,
    ].every(
      (p) =>
        p.fullname &&
        p.gender &&
        (p.birthDate === null ||
          moment(p.birthDate, "YYYY-MM-DD", true).isValid())
    );

    if (!allPassengersValid) {
      message.error("Vui lòng điền đầy đủ thông tin hành khách!");
      return;
    }

    const { singleRoomQuantity } = calculateTotalPrice(
      selectedTourDetail,
      adultQuantity,
      childrenQuantity,
      childQuantity,
      babyQuantity,
      adults
    );

    const formatPassenger = (passenger) => ({
      fullname: passenger.fullname,
      birthDate: passenger.birthDate || null,
      gender: passenger.gender,
      singleRoomSupplement: passenger.singleRoomSupplement || false,
    });

    const orderData = {
      tourDetailId: selectedTourDetail?.id,
      userId: user?.id,
      fullname: userTT.fullname,
      email: userTT.email,
      phone: userTT.phone,
      address: userTT.address,
      adultQuantity,
      childrenQuantity,
      childQuantity,
      babyQuantity,
      singleRoomSupplementPrice:
        selectedTourDetail?.singleRoomSupplementPrice || 0,
      singleRoomSupplementQuantity: singleRoomQuantity,
      originalPrice,
      discountAmount,
      finalPrice,
      note,
      paymentMethod,
      passengers: [
        ...adults.map(formatPassenger),
        ...children.map(formatPassenger),
        ...smallChildren.map(formatPassenger),
        ...babies.map(formatPassenger),
      ],
    };

    try {
      // Lưu booking tạm thời vào backend
      const bookingResponse = await post("bookings/pending", orderData);

      const bookingId = bookingResponse;

      // Gửi yêu cầu tạo URL thanh toán
      const paymentResponse = await post("payments/create_payment", {
        amount: finalPrice,
        orderInfo: `Thanh toan don hang:${bookingId}`,
        language: "vn",
      });

      console.log(paymentResponse);
      
      if (paymentResponse?.status === "OK" && paymentResponse?.url) {
        // Chuyển hướng đến URL thanh toán
        window.location.href = paymentResponse.url;
      } else {
        message.error("Không thể tạo URL thanh toán. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      message.error("Lỗi khi xử lý thanh toán. Vui lòng thử lại!");
    }
  };

  // Xử lý callback từ VNPay
  // useEffect(() => {
  //   const handlePaymentCallback = async () => {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");

  //     if (vnp_ResponseCode === "00") {
  //       message.success("Thanh toán thành công!");
  //       navigate("/");
  //     } else {
  //       message.error("Thanh toán không thành công. Vui lòng thử lại!");
  //     }
  //   };

  //   if (window.location.search.includes("vnp_ResponseCode")) {
  //     handlePaymentCallback();
  //   }
  // }, [navigate]);

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
              <div>
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
              </div>
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
                              value={adultQuantity}
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
                              value={childrenQuantity}
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
                              value={childQuantity}
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
                              value={babyQuantity}
                              max={getMaxValue(babyQuantity, [
                                adultQuantity,
                                childrenQuantity,
                                childQuantity,
                              ])}
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
                      Trẻ nhỏ <span>(Từ 2 - 4 tuổi)</span>
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
                      {moment(selectedTourDetail.dayStart).format("DD-MM-YYYY")}
                    </span>
                  </div>
                  <div className="row">
                    <img src={Calendar} alt="" />
                    <span>Ngày trở về: </span>
                    <span>
                      {moment(selectedTourDetail.dayReturn).format(
                        "DD-MM-YYYY"
                      )}
                    </span>
                  </div>
                </div>
                <div className="preview">
                  <div className="row">
                    <img src={Concho} alt="" />
                    <span>Số chỗ còn: </span>
                    <span>{remainingSlots}</span>
                  </div>
                </div>
                <hr />
                <div className="card-footer">
                  <div className="totalPrice">
                    <div className="left">Tổng tiền trước giảm giá</div>
                    <div className="right">
                      {originalPrice.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                  <div className="totalPrice">
                    <div className="left">Số tiền giảm</div>
                    <div className="right">
                      {discountAmount.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                  <div className="totalPrice">
                    <div className="left">Tổng tiền sau giảm giá</div>
                    <div className="right">
                      {finalPrice.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                  <button onClick={handleOrder}>Thanh toán qua VNPay</button>
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

export default Order;
