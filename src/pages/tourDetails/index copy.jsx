import React, { useEffect, useState, useMemo } from "react";
import "./style.scss";
import { useNavigate, useParams } from "react-router-dom";
import { get } from "../../utils/axios-http/axios-http";
import { Calendar, Collapse, theme, message } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { format, parseISO } from "date-fns";
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

const { Panel } = Collapse;

function TourDetails1() {
  const { id } = useParams();
  const [tourDetails, setTourDetails] = useState(null);
  const [selectedTourDetail, setSelectedTourDetail] = useState(null);
  const [showImageSlider, setShowImageSlider] = useState(false);
  const [departureDates, setDepartureDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = theme.useToken();

  // Debounce để hạn chế cập nhật trạng thái khi nhấp nhanh
  const debouncedSetSelectedTourDetail = debounce(setSelectedTourDetail, 300);

  const handleBookTour = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      message.warning("Vui lòng đăng nhập để đặt tour!");
      navigate("/login");
      return;
    }
    navigate("/order", {
      state: {
        tourDetails: selectedTourDetail || tourDetails,
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await get(`tours/${id}/details`);
        setTourDetails(response.data);
        const dates = Array.isArray(response.data?.tourDetails)
          ? response.data.tourDetails.map((detail) => ({
              formattedDate: format(parseISO(detail.dayStart), "yyyy-MM-dd"),
              detail,
            }))
          : [];
        setDepartureDates(dates);
        if (response.data?.tourDetails?.length > 0) {
          setSelectedTourDetail(response.data.tourDetails[0]);
        }
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
    const formattedDate = format(value.toDate(), "yyyy-MM-dd");
    const selectedDate = departureDates.find(
      (date) => date.formattedDate === formattedDate
    );
    if (selectedDate) {
      return (
        <div
          style={{
            textAlign: "center",
            color: "#fff",
            backgroundColor: "#1890ff",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={() => debouncedSetSelectedTourDetail(selectedDate.detail)}
        >
          Ngày khởi hành
        </div>
      );
    }
    return null;
  };

  const onPanelChange = (value, mode) => {
    console.log(format(value.toDate(), "yyyy-MM-dd"), mode);
  };

  const panelStyle = {
    marginBottom: 20,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const renderScheduleContent = (information) => {
    if (!information) return <p>Chưa có thông tin</p>;

    const paragraphs = information.split("\n\n").map((para) => para.trim());

    return (
      <div className="schedule-content">
        {paragraphs.map((para, index) => {
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

  // Memoize tour-price-info-content để tránh render lại không cần thiết
  const tourPriceInfoContent = useMemo(() => {
    return (
      <div className="tour-price-info-content">
        <div className="item">
          <div className="label">
            <img src={Vitri} alt="Biểu tượng điểm khởi hành" />
            <p>
              Khởi hành: <span>{tourDetails?.departure || "N/A"}</span>
            </p>
          </div>
        </div>
        <div className="item">
          <div className="label">
            <img src={Calenda} alt="Biểu tượng ngày khởi hành" />
            <p>
              Ngày khởi hành:{" "}
              <span>
                {selectedTourDetail?.dayStart
                  ? format(parseISO(selectedTourDetail.dayStart), "dd-MM-yyyy")
                  : tourDetails?.startDate
                  ? format(parseISO(tourDetails.startDate), "dd-MM-yyyy")
                  : "N/A"}
              </span>
            </p>
          </div>
        </div>
        <div className="item">
          <div className="label">
            <img src={Time2} alt="Biểu tượng thời gian" />
            <p>
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
            </p>
          </div>
        </div>
        <div className="item">
          <div className="label">
            <img src={Concho} alt="Biểu tượng số chỗ còn" />
            <p>
              Số chỗ còn{" "}
              <span>{selectedTourDetail?.remainingSlots || "Hết chỗ"} chỗ</span>
            </p>
          </div>
        </div>
      </div>
    );
  }, [selectedTourDetail, tourDetails]);

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

              <div className="tour-detail-content-right">
                <div className="tour-detail-booking">
                  <div className="border-shadow">
                    <div className="tour-price">
                      <div className="price-oldPrice">
                        {selectedTourDetail?.discount > 0 ? (
                          <>
                            <h4>Giá:</h4>
                            <div className="price-discount">
                              <p>
                                <span>
                                  {selectedTourDetail?.adultPrice
                                    ? selectedTourDetail.adultPrice.toLocaleString(
                                        "vi-VN"
                                      )
                                    : "0"}{" "}
                                  đ
                                </span>{" "}
                                / Khách
                              </p>
                            </div>
                            <div className="price">
                              <p>
                                {(
                                  selectedTourDetail?.adultPrice -
                                  (selectedTourDetail?.adultPrice *
                                    selectedTourDetail?.discount) /
                                    100
                                ).toLocaleString("vi-VN") || "0"}{" "}
                                đ <span>/ Khách</span>
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <h4>Giá:</h4>
                            <div className="price">
                              <p>
                                {selectedTourDetail?.adultPrice.toLocaleString(
                                  "vi-VN"
                                ) || "0"}{" "}
                                đ <span>/ Khách</span>
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="tour-price-info">
                      {tourPriceInfoContent}
                    </div>

                    <div className="book-tour-option">
                      {/* <button
                        className="btn-advise"
                        aria-label="Chọn ngày khác"
                      >
                        Ngày khác
                      </button> */}
                      <button
                        className="btn-bookTour"
                        onClick={handleBookTour}
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

export default React.memo(TourDetails1);
