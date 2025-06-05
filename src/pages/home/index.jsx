import React, { useState, useEffect, useRef, useCallback } from "react";
import Slider from "react-slick";
import moment from "moment";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Banner from "../../assets/images/TopBannerWeb.png";
import Oto from "../../assets/images/oto.png";
import TourTet from "../../assets/images/tourtTet.png";
import Dimond from "../../assets/images/dimond.png";
import TieuChuan from "../../assets/images/tieuchuan.png";
import TietKiem from "../../assets/images/tietkiem.png";
import GiaTot from "../../assets/images/giatot.png";
import Slider1 from "../../assets/images/slider1.png";
import Slider2 from "../../assets/images/slider2.png";
import Slider3 from "../../assets/images/slider3.png";
import Slider4 from "../../assets/images/slider4.png";
import Slider5 from "../../assets/images/slider5.png";
import Vitri from "../../assets/images/vitri.png";
import Code from "../../assets/images/code.png";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { Calendar, theme } from "antd";
import { get } from "../../utils/axios-http/axios-http";
import { debounce } from "lodash";

function Home() {
  const images = [Slider1, Slider2, Slider3, Slider4, Slider5];
  const [reverse, setReverse] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tourFeature, setTourFeature] = useState([]);
  const [calendarSearch, setCalendarSearch] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [destinations, setDestination] = useState([]);
  const [filterSearch, setFilterSearch] = useState({
    text: "",
    fromDate: "",
    budgetId: "",
  });

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 400,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const handleSearchInputChange = debounce(async (event) => {
    const value = event.target.value;
    setFilterSearch((prev) => ({ ...prev, text: value }));
    if (value) {
      const response = await get(`destination?title=${value}`);
      setDestination(response || []);
    } else {
      setDestination([]);
    }
  }, 300);
  useEffect(() => {
    const fetchData = async () => {
      const response = await get("tours/feature");
      setTourFeature(response);
    };
    fetchData();
  }, []);

  const handleClickDestination = (slug) => {
    navigate(`/tours/${slug}`);
  };

  const handleSearch = () => {
    navigate(
      `/tours/du-lich/?text=${filterSearch.text}&fromDate=${filterSearch.fromDate}&budgetId=${filterSearch.budgetId}`
    );
  };

  const formatDate = (date) => {
    const dateFormat = date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return dateFormat;
  };

  const handleChangeCalendar = (value) => {
    setShowCalendar(false);
    const date = formatDate(new Date(value));
    const formattedDate = date.split(", ")[1].split("/").reverse().join("-");
    setFilterSearch((prev) => ({
      ...prev,
      fromDate: formattedDate,
    }));
    setCalendarSearch(date);
  };

  const handleSelectBudget = (value) => {
    setFilterSearch((prev) => ({
      ...prev,
      budgetId: value,
    }));
    switch (value) {
      case 1:
        setSelectedBudget("Dưới 5 triệu");
        break;
      case 2:
        setSelectedBudget("Từ 5 - 10 triệu");
        break;
      case 3:
        setSelectedBudget("Từ 10 - 20 triệu");
        break;
      case 4:
        setSelectedBudget("Trên 20 triệu");
        break;
      default:
        setSelectedBudget("Chọn mức giá");
        break;
    }
    setShowDropdown(false);
  };
  useEffect(() => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const tomorrow = formatDate(now);
    if (tomorrow) {
      setCalendarSearch(tomorrow);
    }
  }, []);

  const handleClickCalendar = useCallback(() => {
    setShowCalendar((prev) => !prev);
  }, []);

  const handleClickDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  const handleNavigate = (slug) => {
    navigate(`/tours/${slug}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    rtl: reverse,
    afterChange: (current) => {
      const totalSlides = images.length;
      if (current === totalSlides - 1) {
        setReverse(true);
      } else if (current === 0) {
        setReverse(false);
      }
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          initialSlide: 4,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickPause();
      setTimeout(() => {
        sliderRef.current.slickPlay();
      }, 3000);
    }
  }, []);

  return (
    <div className="home-container">
      <div className="home-banner">
        <div className="banner-img">
          <img src={Banner} alt="" />
        </div>
        <div className="banner-content">
          <div className="banner-search-tab">
            <div className="bst-content">
              <img src={Oto} alt="" />
              <p>Tour trọn gói</p>
            </div>
          </div>
          <div className="banner-search-body">
            <div className="bsb-container">
              <div className="bsb-input">
                <div className="input-container">
                  <div className="input-content">
                    <label htmlFor="">
                      Bạn muốn đi đâu?<span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="input input-search">
                      <input
                        type="text"
                        placeholder="Tìm kiếm với bất kỳ địa điểm bạn yêu thích!"
                        // value={filterSearch.destination}
                        onChange={handleSearchInputChange}
                      />
                    </div>
                    {destinations.length > 0 && (
                      <div className="destinations">
                        {destinations.map((record, index) => (
                          <div
                            key={index}
                            className="destination-item"
                            onClick={() => handleClickDestination(record.slug)}
                          >
                            <img src={record.image} alt={record.title} />
                            <p>{record.title}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="hasDivider"></div>
                <div className="input-container">
                  <div className="input-content  input-calendar">
                    <label htmlFor="">Ngày đi</label>
                    <div className="input" onClick={handleClickCalendar}>
                      <span>{calendarSearch}</span>
                    </div>
                  </div>
                  {showCalendar && (
                    <div style={wrapperStyle} className="calendar">
                      <Calendar
                        fullscreen={false}
                        onChange={handleChangeCalendar}
                        disabledDate={(current) =>
                          current && current <= moment().endOf("day")
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="hasDivider"></div>
                <div className="input-container">
                  <div
                    className="input-content input-budget"
                    onClick={handleClickDropdown}
                  >
                    <label htmlFor="">Ngân sách: </label>
                    <p style={{ fontSize: "20px" }}>
                      {selectedBudget ? selectedBudget : "Chọn mức giá"}
                    </p>
                  </div>

                  <div className="dropdown">
                    {showDropdown && (
                      <div className="dropdown-content">
                        <span
                          className="drp-list"
                          onClick={() => handleSelectBudget(1)}
                        >
                          Dưới 5 triệu
                        </span>
                        <span
                          className="drp-list"
                          onClick={() => handleSelectBudget(2)}
                        >
                          Từ 5 - 10 triệu
                        </span>
                        <span
                          className="drp-list"
                          onClick={() => handleSelectBudget(3)}
                        >
                          Từ 10 - 20 triệu
                        </span>
                        <span
                          className="drp-list"
                          onClick={() => handleSelectBudget(4)}
                        >
                          Trên 20 triệu
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bsb-icon">
                <button onClick={handleSearch}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="select-tour">
        <div className="select-tour-container">
          <div className="select-tour-button">
            <div className="stb-list">
              <button onClick={() => handleNavigate("tet")}>
                <img src={TourTet} alt="" />
              </button>
              <p>
                TOUR <br />
                TẾT
              </p>
            </div>
            <div className="stb-list">
              <button onClick={() => handleNavigate("du-lich-cao-cap")}>
                <img src={Dimond} alt="" />
              </button>
              <p>
                TOUR <br />
                CAO CẤP
              </p>
            </div>
            <div className="stb-list">
              <button onClick={() => handleNavigate("du-lich-tieu-chuan")}>
                <img src={TieuChuan} alt="" />
              </button>
              <p>
                TOUR <br />
                TIÊU CHUẨN
              </p>
            </div>
            <div className="stb-list">
              <button onClick={() => handleNavigate("du-lich-tiet-kiem")}>
                <img src={TietKiem} alt="" />
              </button>
              <p>
                TOUR <br />
                TIẾT KIỆM
              </p>
            </div>
            <div className="stb-list">
              <button onClick={() => handleNavigate("du-lich-gia-tot")}>
                <img src={GiaTot} alt="" />
              </button>
              <p>
                TOUR <br />
                GIA TỐT
              </p>
            </div>
          </div>
          <Slider {...settings} ref={sliderRef}>
            {images.map((image, key) => (
              <div className="each-slider" key={key}>
                <img src={image} alt="" />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <div className="tour-feature">
        <div className="tour-feature-container">
          <div className="tour-feature-header">
            <h1>Khám phá sản phẩm vietravel</h1>
            <div className="horizontal-divider"></div>
            <h2>
              Hãy tận hưởng trải nghiệm du lịch chuyên nghiệp, mang lại cho bạn
              những khoảnh khắc tuyệt vời và nâng tầm cuộc sống. Chúng tôi cam
              kết mang đến những chuyến đi đáng nhớ, giúp bạn khám phá thế giới
              theo cách hoàn hảo nhất.
            </h2>
          </div>
          <div className="tour-feature-content">
            <div className="tour-feature-track">
              <ul className="tour-feature-list">
                <li>
                  <div className="tour-card">
                    <div className="background">
                      <img
                        src={tourFeature?.tours?.[1]?.images?.[1]?.source}
                        alt=""
                        onClick={() =>
                          navigate(
                            `/tour-details/${tourFeature?.tours?.[1]?.slug}`
                          )
                        }
                      />
                      <div className="tour-card-large"></div>
                    </div>
                    <div className="content">
                      <div className="preview">
                        <div className="preview-content">
                          <p className="line-clamp">
                            {tourFeature?.tours?.[1]?.title}
                          </p>
                          <div className="tour-promotion">
                            <div className="text">
                              <img src={Vitri} alt="" />
                              <p>Khởi hành: </p>
                            </div>
                            <span>
                              {tourFeature?.tours?.[1]?.departure?.title}
                            </span>
                          </div>
                          <div className="tour-promotion">
                            <div className="text">
                              <img src={Code} alt="" />
                              <p>Mã chương trình: </p>
                            </div>
                            <span>{tourFeature?.tours?.[1]?.code}</span>
                          </div>
                        </div>
                        <div className="preview-pric">
                          <div className="price">
                            <div className="price-oldPrice">
                              <p>Giá từ</p>
                            </div>
                            <div className="price-newPrice">
                              <span>13.390.000đ</span>
                            </div>
                          </div>
                          <div className="button">
                            <button
                              onClick={() =>
                                navigate(
                                  `/tour-details/${tourFeature?.tours?.[1]?.slug}`
                                )
                              }
                            >
                              Xem chi tiết
                              <i className="fa-solid fa-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="tour-card">
                    <div className="background">
                      <img
                        src={tourFeature?.tours?.[2]?.images?.[1]?.source}
                        alt=""
                        onClick={() =>
                          navigate(
                            `/tour-details/${tourFeature?.tours?.[2]?.slug}`
                          )
                        }
                      />
                      <div className="tour-card-large"></div>
                    </div>
                    <div className="content">
                      <div className="preview">
                        <div className="preview-content">
                          <p className="line-clamp">
                            {tourFeature?.tours?.[2]?.title}
                          </p>
                          <div className="tour-promotion">
                            <div className="text">
                              <img src={Vitri} alt="" />
                              <p>Khởi hành: </p>
                            </div>
                            <span>
                              {tourFeature?.tours?.[2]?.departure?.title}
                            </span>
                          </div>
                          <div className="tour-promotion">
                            <div className="text">
                              <img src={Code} alt="" />
                              <p>Mã chương trình: </p>
                            </div>
                            <span>{tourFeature?.tours?.[2]?.code}</span>
                          </div>
                        </div>
                        <div className="preview-pric">
                          <div className="price">
                            <div className="price-oldPrice">
                              <p>Giá từ</p>
                            </div>
                            <div className="price-newPrice">
                              <span>12.230.000đ</span>
                            </div>
                          </div>
                          <div className="button">
                            <button
                              onClick={() =>
                                navigate(
                                  `/tour-details/${tourFeature?.tours?.[2]?.slug}`
                                )
                              }
                            >
                              Xem chi tiết
                              <i className="fa-solid fa-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="tour-card">
                    <div className="background">
                      <img
                        src={tourFeature?.tours?.[3]?.images?.[1]?.source}
                        alt=""
                        onClick={() =>
                          navigate(
                            `/tour-details/${tourFeature?.tours?.[3]?.slug}`
                          )
                        }
                      />
                      <div className="tour-card-large"></div>
                    </div>
                    <div className="content">
                      <div className="preview">
                        <div className="preview-content">
                          <p className="line-clamp">
                            {tourFeature?.tours?.[3]?.title}
                          </p>
                          <div className="tour-promotion">
                            <div className="text">
                              <img src={Vitri} alt="" />
                              <p>Khởi hành: </p>
                            </div>
                            <span>
                              {tourFeature?.tours?.[3]?.departure?.title}
                            </span>
                          </div>
                          <div className="tour-promotion">
                            <div className="text">
                              <img src={Code} alt="" />
                              <p>Mã chương trình: </p>
                            </div>
                            <span>{tourFeature?.tours?.[3]?.code}</span>
                          </div>
                        </div>
                        <div className="preview-pric">
                          <div className="price">
                            <div className="price-oldPrice">
                              <p>Giá từ</p>
                            </div>
                            <div className="price-newPrice">
                              <span>200.000đ</span>
                            </div>
                          </div>
                          <div className="button">
                            <button
                              onClick={() =>
                                navigate(
                                  `/tour-details/${tourFeature?.tours?.[3]?.slug}`
                                )
                              }
                            >
                              Xem chi tiết
                              <i className="fa-solid fa-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
