import React, { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "../../utils/axios-http/axios-http";
import { Calendar, Collapse, theme } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import ImageSlider from "./imageSlider";
import Map from "../../assets/images/map.png";
import Eat from "../../assets/images/eat.png";
import Friend from "../../assets/images/friend.png";
import Time from "../../assets/images/time2.png";
import Oto from "../../assets/images/oto.png";
import Sale from "../../assets/images/sale.png";
import Code from "../../assets/images/code.png";
import Vitri from "../../assets/images/vitri.png";
import Calenda from "../../assets/images/celanda.png";
import Time2 from "../../assets/images/time.png";
import Concho from "../../assets/images/concho.png";
import moment from "moment";

const { Panel } = Collapse;

function TourDetails1() {
  const { id } = useParams();
  const [tourDetails, setTourDetails] = useState(null);
  const [showImageSlider, setShowImageSlider] = useState(false);
  const [departureDates, setDepartureDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = theme.useToken(); // Hook gọi ở đầu

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await get(`tours/${id}/details`);
        console.log("Dữ liệu API:", response.data);
        setTourDetails(response.data);
        const dates = Array.isArray(response.data?.tourDetails)
          ? response.data.tourDetails.map((detail) =>
              moment(detail.dayStart).format("YYYY-MM-DD")
            )
          : [];
        setDepartureDates(dates);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết tour:", error);
        setTourDetails(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    if (
      Array.isArray(departureDates) &&
      departureDates.includes(formattedDate)
    ) {
      return (
        <div
          style={{
            textAlign: "center",
            color: "#fff",
            backgroundColor: "#1890ff",
            borderRadius: "50%",
          }}
        >
          Ngày khởi hành
        </div>
      );
    }
    return null;
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  const panelStyle = {
    marginBottom: 20,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  // Tách và render nội dung information đẹp hơn
  const renderScheduleContent = (information) => {
    if (!information) return <p>Chưa có thông tin</p>;

    // Tách chuỗi information thành mảng dựa trên \n\n
    const paragraphs = information.split("\n\n").map((para) => para.trim());

    return (
      <div className="schedule-content">
        {paragraphs.map((para, index) => {
          // Nếu đoạn bắt đầu bằng "- ", hiển thị dưới dạng danh sách
          if (para.startsWith("- ")) {
            const items = para
              .split("\n")
              .map((item) => item.trim().replace(/^- /, ""));
            return (
              <ul key={index} style={{ margin: "10px 0", paddingLeft: "20px" }}>
                {items.map((item, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          // Các đoạn không phải danh sách hiển thị dưới dạng <p>
          return (
            <p key={index} style={{ margin: "10px 0" }}>
              {para}
            </p>
          );
        })}
      </div>
    );
  };

  const scheduleItems = Array.isArray(tourDetails?.tourSchedules)
    ? tourDetails.tourSchedules.map((item) => ({
        key: item.id,
        label: `Ngày ${item.day}: ${item.title}`,
        children: renderScheduleContent(item.information),
        style: panelStyle,
      }))
    : [];

  if (isLoading) return <div>Đang tải...</div>;
  if (!tourDetails) return <div>Không tìm thấy tour</div>;

  return (
    <div className="tour-details">
      <div className="tour-details-main">
        <div className="tour-details-container">
          <div className="tour-details-header">
            <div className="tour-header-content">
              <div className="breadcrumb-container">
                <p
                  className="p1"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/")}
                  role="button"
                  aria-label="Quay lại trang chủ"
                >
                  Du lịch /{" "}
                </p>
                <p className="p2">
                  {tourDetails.title || "Tour không xác định"}
                </p>
              </div>
              <h2>{tourDetails.title || "Tour không xác định"}</h2>
            </div>
          </div>

          <div className="tour-detail-content-container">
            <div className="tour-detail-content">
              <div className="tour-detail-content-left">
                <div className="image-gallery">
                  {/* Thông tin ảnh */}
                  <div className="image-gallery-wrapper">
                    <div className="image-thumbnails">
                      {Array.isArray(tourDetails.tourImages) &&
                      tourDetails.tourImages.length > 0 ? (
                        tourDetails.tourImages.map((item, key) => (
                          <div
                            className="thumnails-animate"
                            onClick={() => setShowImageSlider(true)}
                            key={key}
                            role="button"
                            aria-label={`Xem ảnh ${item.imageUrl}`}
                          >
                            <img
                              src={item.imageUrl}
                              alt={`Hình ảnh tour ${key + 1}`}
                            />
                          </div>
                        ))
                      ) : (
                        <p>Không có hình ảnh</p>
                      )}
                    </div>
                    <div
                      className="image-main"
                      onClick={() => setShowImageSlider(true)}
                      role="button"
                      aria-label="Xem ảnh chính"
                    >
                      <img
                        src={
                          tourDetails.tourImages?.[0]?.imageUrl ||
                          "https://via.placeholder.com/300"
                        }
                        alt="Hình ảnh chính của tour"
                      />
                    </div>
                  </div>
                </div>
                <div className="tour-calendar">
                  <div className="section-detail">
                    <h3>Lịch khởi hành</h3>
                    <div className="calendar">
                      <Calendar
                        dateCellRender={dateCellRender}
                        onPanelChange={onPanelChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Thông tin thêm về chuyến đi */}
                <div className="overview">
                  <div className="section-detail">
                    <h3 className="title">Thông tin thêm về chuyến đi</h3>
                    <div className="overview-content">
                      <div className="overview-content-item">
                        <img src={Map} alt="Biểu tượng điểm tham quan" />
                        <h3>Điểm tham quan</h3>
                        <p>
                          {tourDetails.tourInformation?.attractions ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                      <div className="overview-content-item">
                        <img src={Eat} alt="Biểu tượng ẩm thực" />
                        <h3>Ẩm thực</h3>
                        <p>
                          {tourDetails.tourInformation?.cuisine ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                      <div className="overview-content-item">
                        <img
                          src={Friend}
                          alt="Biểu tượng đối tượng thích hợp"
                        />
                        <h3>Đối tượng thích hợp</h3>
                        <p>
                          {tourDetails.tourInformation?.suitableObject ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                      <div className="overview-content-item">
                        <img src={Time} alt="Biểu tượng thời gian lý tưởng" />
                        <h3>Thời gian lý tưởng</h3>
                        <p>
                          {tourDetails.tourInformation?.idealTime ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                      <div className="overview-content-item">
                        <img src={Oto} alt="Biểu tượng phương tiện" />
                        <h3>Phương tiện</h3>
                        <p>
                          {tourDetails.tourInformation?.vehicle ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                      <div className="overview-content-item">
                        <img src={Sale} alt="Biểu tượng khuyến mãi" />
                        <h3>Khuyến mãi</h3>
                        <p>
                          {tourDetails.tourInformation?.promotion ||
                            "Chưa có thông tin"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lịch trình */}
                <div className="schedule">
                  <div className="section-detail">
                    <h3 className="title">Lịch trình</h3>
                    {scheduleItems.length > 0 ? (
                      <Collapse
                        className="collapse"
                        items={scheduleItems}
                        accordion
                        style={{
                          width: "100%",
                          margin: "auto",
                          background: token.colorBgContainer,
                        }}
                        bordered={false}
                        defaultActiveKey={[]}
                        expandIcon={({ isActive }) => (
                          <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                      />
                    ) : (
                      <p>Chưa có lịch trình</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin đặt tour */}
              <div className="tour-detail-content-right">
                <div className="tour-detail-booking">
                  <div className="border-shadow">
                    <div className="tour-price">
                      <div className="price-oldPrice">
                        <h4>Giá:</h4>
                        <div className="price-discount">
                          <p>
                            <span>
                              {tourDetails.price?.old || "6.490.000"} đ
                            </span>{" "}
                            / Khách
                          </p>
                        </div>
                      </div>
                      <div className="price">
                        <p>
                          {tourDetails.price?.current || "5.990.000"} đ{" "}
                          <span>/ Khách</span>
                        </p>
                      </div>
                    </div>
                    <div className="tour-price-info">
                      <div className="tour-price-info-content">
                        <div className="item">
                          <div className="label">
                            <img src={Code} alt="Biểu tượng mã tour" />
                            <p>
                              Mã tour: <span>{tourDetails.code || "N/A"}</span>
                            </p>
                          </div>
                        </div>
                        <div className="item">
                          <div className="label">
                            <img src={Vitri} alt="Biểu tượng điểm khởi hành" />
                            <p>
                              Khởi hành:{" "}
                              <span>{tourDetails.departure || "N/A"}</span>
                            </p>
                          </div>
                        </div>
                        <div className="item">
                          <div className="label">
                            <img
                              src={Calenda}
                              alt="Biểu tượng ngày khởi hành"
                            />
                            <p>
                              Ngày khởi hành:{" "}
                              <span>
                                {tourDetails.startDate || "31-12-2024"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="item">
                          <div className="label">
                            <img src={Time2} alt="Biểu tượng thời gian" />
                            <p>
                              Thời gian:{" "}
                              <span>{tourDetails.duration || "4N3Đ"}</span>
                            </p>
                          </div>
                        </div>
                        <div className="item">
                          <div className="label">
                            <img src={Concho} alt="Biểu tượng số chỗ còn" />
                            <p>
                              Số chỗ còn{" "}
                              <span>
                                {tourDetails.availableSeats || "9"} chỗ
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="book-tour-option">
                      <button
                        className="btn-advise"
                        aria-label="Chọn ngày khác"
                      >
                        Ngày khác
                      </button>
                      <button
                        className="btn-bookTour"
                        onClick={() =>
                          navigate("/order", { state: { tourDetails } })
                        }
                        aria-label="Đặt tour"
                      >
                        Đặt tour
                      </button>
                    </div>
                  </div>
                  <div className="tour-contact">
                    <div className="tour-contact-group">
                      <button
                        className="btn-phone"
                        onClick={() =>
                          (window.location.href = "tel:+84824783053")
                        }
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
      </div>

      {showImageSlider && Array.isArray(tourDetails.tourImages) && (
        <div className="overlay" onClick={() => setShowImageSlider(false)}>
          <motion.div
            className="note-container"
            onClick={(e) => e.stopPropagation()}
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <ImageSlider
              image={tourDetails.tourImages}
              onCancel={() => setShowImageSlider(false)}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default TourDetails1;
