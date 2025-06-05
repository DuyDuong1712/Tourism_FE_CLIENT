import React, { useEffect, useState, useCallback } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import Code from "../../assets/images/code.png";
import Vitri from "../../assets/images/vitri.png";
import Time from "../../assets/images/time.png";
import Flight from "../../assets/images/flight.png";
import Celanda from "../../assets/images/celanda.png";
import "./style.scss";
import { get } from "../../utils/axios-http/axios-http";
import { message, Select, Calendar, theme } from "antd";
import getChildren from "../../utils/getChildrenDestination";
import moment from "moment";

const { Option } = Select;
function Tour() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarSearch, setCalendarSearch] = useState("");
  const [tours, setTours] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [transportations, setTransportations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTransportation, setSelectedTransportation] = useState(null);
  const location = useLocation();

  const fetchData = async () => {
    try {
      // setLoading(true);
      const query = Object.fromEntries(searchParams.entries());
      if (slug == "du-lich") {
        const response = await get(`tours`, query);
        setTours(response || []);
      } else {
        const response = await get(`tours/${slug}`, query);
        setTours(response || []);
      }
      const [
        departuresData,
        destinationsData,
        transportationsData,
        categoriesData,
      ] = await Promise.all([
        get("departures"),
        get("destination/get-tree"),
        get("transportations"),
        get("categories"),
      ]);

      const destinationChildrens = getChildren(destinationsData);

      setDepartures(departuresData || []);
      setDestinations(destinationChildrens || []);
      setTransportations(transportationsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu tour!");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const params = new URLSearchParams(location.search);
    const budgetId = params.get("budgetId");
    const tourLine = params.get("tourLine");
    const transTypeId = params.get("transTypeId");
    const departureFrom = params.get("departureFrom");
    setSelectedBudget(budgetId);
    setSelectedCategory(tourLine);
    setSelectedTransportation(transTypeId);
  }, [slug, searchParams]);

  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 400,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
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

  const handleChangeCalendar = (value) => {
    setShowCalendar(false);
    const date = formatDate(new Date(value));
    const formattedDate = date.split(", ")[1].split("/").reverse().join("-");
    setSearchParams((prev) => ({
      ...prev,
      fromDate: formattedDate,
    }));
    setCalendarSearch(date);
  };
  const handleAddSearchParam = (key, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set(key, value);
      return params;
    });
  };

  return (
    <div className="tour-container">
      <div className="find-tour-header">
        <div className="find-tour-header-container">
          <div className="breadcrumb-container">
            <p
              className="normal-link"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Điểm đến /
            </p>
            <p className="active-link">{slug}</p>
          </div>
          <div className="title">
            <h1>{slug}</h1>
          </div>
        </div>
      </div>
      <div className="find-tour-content">
        <div className="find-tour-content-container">
          <div className="find-tour-content-filter">
            <p className="filter-sidebar-header">Bộ lọc tìm kiếm</p>
            <div className="filter-section">
              <div className="filter-range">
                <div className="title">
                  <p>Ngân sách:</p>
                </div>
                <div className="list">
                  <div
                    className={`list-item ${
                      selectedBudget == 1 ? "btn-active" : ""
                    }`}
                    onClick={() => {
                      handleAddSearchParam("budgetId", 1);
                      setSelectedBudget(1);
                    }}
                  >
                    Dưới 5 triệu
                  </div>
                  <div
                    className={`list-item ${
                      selectedBudget == 2 ? "btn-active" : ""
                    }`}
                    onClick={() => {
                      handleAddSearchParam("budgetId", 2);
                      setSelectedBudget(2);
                    }}
                  >
                    Từ 5 đến 10 triệu
                  </div>
                  <div
                    className={`list-item ${
                      selectedBudget == 3 ? "btn-active" : ""
                    }`}
                    onClick={() => {
                      handleAddSearchParam("budgetId", 3);
                      setSelectedBudget(3);
                    }}
                  >
                    Từ 10 - 20 triệu
                  </div>
                  <div
                    className={`list-item ${
                      selectedBudget == 4 ? "btn-active" : ""
                    }`}
                    onClick={() => {
                      handleAddSearchParam("budgetId", 4);
                      setSelectedBudget(4);
                    }}
                  >
                    Trên 20 triệu
                  </div>
                </div>
              </div>
              <div className="filter-option">
                <div className="title">
                  <p>Điểm khởi hành</p>
                </div>
                <div className="select-container">
                  <Select
                    className="button"
                    // style={{ width: 200, marginRight: 10 }}
                    placeholder="Chọn điểm khởi hành"
                    onChange={(value) => {
                      handleAddSearchParam("departureFrom", value);
                    }}
                  >
                    <Option value="">Tất cả</Option>
                    {departures.map((departure) => (
                      <Option key={departure.id} value={departure.id}>
                        {departure.title}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="filter-option">
                <div className="title">
                  <p>Điểm đến</p>
                </div>
                <div className="select-container">
                  <Select
                    className="button"
                    // style={{ width: 200, marginRight: 10 }}
                    placeholder="Chọn điểm khởi hành"
                    onChange={(value) => {
                      navigate(`/tours/${value}`);
                    }}
                  >
                    <Option value="du-lich">Tất cả</Option>
                    {destinations.map((destination) => (
                      <Option key={destination.id} value={destination.slug}>
                        {destination.title}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="filter-calendar">
                <div className="title">
                  <p>Ngày đi</p>
                </div>
                <div className="input-container">
                  <div className="input" onClick={handleClickCalendar}>
                    <span>{calendarSearch}</span>
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
              </div>
              <div className="filter-options">
                <div className="title">
                  <p>Dòng tour</p>
                </div>
                <div className="select-container">
                  {categories &&
                    categories.map((item) => (
                      <button
                        className={
                          selectedCategory == item.id ? "btn-active" : ""
                        }
                        key={item.id}
                        onClick={() => {
                          navigate(`/tours/du-lich?tourLine=${item.id}`);
                          setSelectedCategory(item.id);
                        }}
                      >
                        {item.title}
                      </button>
                    ))}
                </div>
              </div>
              <div className="filter-options">
                <div className="title">
                  <p>Phương tiện</p>
                </div>
                <div className="select-container">
                  {transportations &&
                    transportations.map((item) => (
                      <button
                        className={
                          selectedTransportation == item.id ? "btn-active" : ""
                        }
                        key={item.id}
                        onClick={() => {
                          handleAddSearchParam("transTypeId", item.id);
                          setSelectedTransportation(item.id);
                        }}
                      >
                        {item.title}
                      </button>
                    ))}
                </div>
              </div>
              <button
                className="filter-btn"
                onClick={() => {
                  setSearchParams({});
                  setSelectedBudget(null);
                  setSelectedCategory(null);
                  setSelectedTransportation(null);
                }}
              >
                Xóa
              </button>
            </div>
          </div>
          <div className="find-tour-content-list">
            <div className="find-tour-content-list-header">
              <div className="left-filter">
                <p>
                  Chúng tôi tìm thấy <span>{tours.length}</span> chương trình
                  cho quý khách
                </p>
              </div>
              <div className="right-sort">
                <span className="label">Sắp xếp theo: </span>
                <div className="right-sort-select">
                  <div className="select-container">
                    <Select
                      style={{ width: 200, marginRight: 10 }}
                      placeholder="Tất cả"
                    >
                      <Option value="">Tất cả</Option>
                      <Option value="">Giá từ cao đến thấp</Option>
                      <Option value="">Giá từ thấp đến cao</Option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="find-tour-content-list-main">
              {tours.map((item, key) => (
                <div
                  key={key}
                  className="card-filter-desktop"
                  onClick={() => navigate(`/tour-details/${item.slug}`)}
                >
                  <div className="card-filter-thumbnail">
                    <img src={item.image} alt="" />
                    <div className="card-category">
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <div className="card-filter-desktop-content">
                    <div className="info">
                      <div className="info-content">
                        <div className="info-content-header">
                          <p>{item.title}</p>
                        </div>
                        <div className="info-tour">
                          <div className="info-tour-code">
                            <div className="info-tour-code-content">
                              <div className="code-left">
                                <img src={Code} alt="" />
                                <label htmlFor="">Mã tour:</label>
                              </div>
                              <p>{item.code}</p>
                            </div>
                            <div className="info-tour-code-content">
                              <div className="code-left">
                                <img src={Vitri} alt="" />
                                <label htmlFor="">Khởi hành:</label>
                              </div>
                              <p>{item.departure}</p>
                            </div>
                          </div>
                          <div className="info-tour-code">
                            <div className="info-tour-code-content">
                              <div className="code-left">
                                <img src={Time} alt="" />
                                <label htmlFor="">Thời gian: </label>
                              </div>
                              <p>5N4Đ</p>
                            </div>
                            <div className="info-tour-code-content">
                              <div className="code-left">
                                <img src={Flight} alt="" />
                                <label htmlFor="">Phương tiện:</label>
                              </div>
                              <p>{item.transportation}</p>
                            </div>
                          </div>
                          <div className="info-tour-calenda"></div>
                        </div>
                      </div>
                    </div>
                    <div className="price">
                      <div className="price-content">
                        <div className="price-content-label">
                          <p>Giá từ:</p>
                        </div>
                        <div className="price-content-price">
                          <p>
                            <span>{item.price.toLocaleString()} </span>VNĐ
                          </p>
                        </div>
                      </div>
                      <div
                        className="price-btn"
                        onClick={() => navigate(`/tour-details/${item.slug}`)}
                      >
                        <button>Xem chi tiết</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tour;
