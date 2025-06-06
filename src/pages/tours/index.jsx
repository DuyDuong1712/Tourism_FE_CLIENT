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
import { i } from "framer-motion/client";

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
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const location = useLocation();

  // Hàm xây dựng cây từ danh sách phẳng
  const buildTree = (items) => {
    const map = {};
    const tree = [];

    items.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    items.forEach((item) => {
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].children.push(map[item.id]);
      } else {
        tree.push(map[item.id]);
      }
    });

    return tree;
  };

  const fetchData = async () => {
    try {
      // setLoading(true);
      const query = Object.fromEntries(searchParams.entries());
      if (slug === "du-lich") {
        const response = await get(`tours`, query);
        setTours(response.data || []);
        console.log(response.data);
      } else {
        const response = await get(`tours/${slug}`, query);
        setTours(response.data || []);
        console.log(`Dữ liệu tours cho ${slug}:`, response.data);
      }

      const [
        departuresData,
        destinationsData,
        transportationsData,
        categoriesData,
      ] = await Promise.all([
        get("departures"),
        get("destinations"),
        get("transportations"),
        get("categories"),
      ]);

      const destinationChildrens = getChildren(
        buildTree(destinationsData.data)
      );

      // // console.log("destinationChildrens", destinationChildrens);

      // // console.log("response.data", tours);
      // // console.log("departuresData.data", departuresData.data);
      // // console.log("destinationsData.data", destinationsData.data);
      // console.log("transportationsData.data", transportationsData.data);
      // // console.log("categoriesData.data", categoriesData.data);
      // // console.log("destinationChildrens", destinationChildrens);

      setDepartures(departuresData.data || []);
      setDestinations(destinationChildrens || []);
      setTransportations(transportationsData.data || []);
      setCategories(categoriesData.data || []);
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
    const categoryId = params.get("categoryId");
    const transTypeId = params.get("transTypeId");
    const departureId = params.get("departureId");
    setSelectedBudget(budgetId);
    setSelectedCategory(categoryId);
    setSelectedTransportation(transTypeId);
    setSelectedDeparture(departureId);
  }, [slug, searchParams]);

  //Theme and Date Formatting
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
  //Đặt ngày mặc định là ngày mai khi component mount.
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

  //Xử lý khi người dùng chọn ngày trên lịch.
  const handleChangeCalendar = (value) => {
    setShowCalendar(false);
    const date = formatDate(new Date(value));
    const formattedDate = date.split(", ")[1].split("/").reverse().join("-");
    //Cập nhật query parameter fromDate trong URL bằng setSearchParams.
    setSearchParams((prev) => ({
      ...prev,
      fromDate: formattedDate,
    }));
    //Lưu ngày đã định dạng vào calendarSearch.
    setCalendarSearch(date);
  };

  // Hàm cập nhật một query parameter trong URL.
  const handleAddSearchParam = (key, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (value === "") {
        params.delete(key); // Xóa khỏi URL nếu là "Tất cả"
      } else {
        params.set(key, value); // Thêm nếu có giá trị
      }

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
            <p className="active-link">
              {slug === "du-lich" ? "Tất cả" : slug}
            </p>
          </div>
          <div className="title">
            <h1>{slug === "du-lich" ? "DU LỊCH" : `DU LỊCH ${slug}`}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="find-tour-content">
        <div className="find-tour-content-container">
          <div className="find-tour-content-filter">
            <p className="filter-sidebar-header">Bộ lọc tìm kiếm</p>
            <div className="filter-section">
              {/* Ngân sách */}
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
              {/* Điểm khởi hành */}
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
                      handleAddSearchParam("departureId", value);
                    }}
                  >
                    <Option value="">Tất cả</Option>
                    {departures.map((departure) => (
                      <Option key={departure.id} value={departure.id}>
                        {departure.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              {/* Điểm đến */}
              <div className="filter-option">
                <div className="title">
                  <p>Điểm đến</p>
                </div>
                <div className="select-container">
                  <Select
                    className="button"
                    // style={{ width: 200, marginRight: 10 }}
                    placeholder="Chọn điểm đến"
                    onChange={(value) => {
                      // Chuẩn hóa slug: thay dấu chấm bằng khoảng trắng và encode
                      // const slugified = slugify(value); // Thay dấu chấm bằng khoảng trắng
                      if (value === "du-lich") {
                        navigate(`/tours/du-lich`);
                      } else {
                        const encodedValue = encodeURIComponent(value);
                        navigate(`/tours/${encodedValue}`);
                      }
                    }}
                  >
                    <Option value="du-lich">Tất cả</Option>
                    {destinations.map((destination) => (
                      <Option key={destination.id} value={destination.name}>
                        {destination.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              {/* Ngày đi */}
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

              {/* Dòng tour */}
              <div className="filter-options">
                <div className="title">
                  <p>Danh mục tour</p>
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
                          handleAddSearchParam("categoryId", item.id);
                          setSelectedCategory(item.id);
                        }}
                      >
                        {item.name}
                      </button>
                    ))}
                </div>
              </div>

              {/* Phương tiện */}
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
                        {item.name}
                      </button>
                    ))}
                </div>
              </div>
              {/* Xóa bộ lọc */}
              <button
                className="filter-btn"
                onClick={() => {
                  setSearchParams({});
                  setSelectedBudget(null);
                  setSelectedCategory(null);
                  setSelectedTransportation(null);
                  setSelectedDeparture(null);
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
                  onClick={() => navigate(`/tour-details/${item.title}`)}
                >
                  <div className="card-filter-thumbnail">
                    <img src={item.tourImages} alt="" />
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
                                <label htmlFor="">Danh mục tour:</label>
                              </div>
                              <p>{item.category}</p>
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
                              <p>
                                {item.duration}N{item.duration - 1}D
                              </p>
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
                        onClick={() => navigate(`/tour-details/${item.title}`)}
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
