import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import Logo from "../../assets/images/logo.png";
import { useSelector } from "react-redux";
import { get } from "../../utils/axios-http/axios-http";

// Component đệ quy hiển thị cây destination
const DestinationTree = ({ data, onSelect }) => {
  if (!data || data.length === 0) return null;
  return (
    <ul className="destination-tree">
      {data.map((item) => (
        <li key={item.id}>
          <span className="destination-title" onClick={() => onSelect(item)}>
            {item.title}
          </span>
          {item.children && item.children.length > 0 && (
            <DestinationTree data={item.children} onSelect={onSelect} />
          )}
        </li>
      ))}
    </ul>
  );
};

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("accessToken");

  const [showDestMenu, setShowDestMenu] = useState(false);
  const [destTree, setDestTree] = useState([]);
  const menuRef = useRef();

  // Lấy danh sách destination tree khi mở menu
  const handleOpenDestMenu = async () => {
    setShowDestMenu(true);
    if (destTree.length === 0) {
      const data = await get("destination/get-tree");
      setDestTree(data || []);
    }
  };

  // Ẩn menu khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDestMenu(false);
      }
    };
    if (showDestMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDestMenu]);

  // Khi chọn 1 destination
  const handleSelectDestination = (item) => {
    setShowDestMenu(false);
    navigate(`/tours/${item.slug}`);
  };

  return (
    <div className="header">
      <div className="header-image">
        <img src={Logo} alt="" onClick={() => navigate("/")} />
      </div>
      <div className="header-menu">
        <nav>
          <ul>
            <li style={{ position: "relative" }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenDestMenu();
                }}
              >
                Điểm đến
              </a>
              {showDestMenu && (
                <div className="destination-overlay" ref={menuRef}>
                  <div className="destination-menu">
                    <h3>Điểm đến</h3>
                    <DestinationTree
                      data={destTree}
                      onSelect={handleSelectDestination}
                    />
                  </div>
                </div>
              )}
            </li>
            <li>
              <a href="https://vietravelmice.com/">Vietravel Mice</a>
            </li>
            <li>
              <a href="https://vietravelplus.com/">Vietravel Loyalty</a>
            </li>
            <li>
              <a href="https://travel.com.vn/lien-he.aspx">Liên hệ</a>
            </li>
            <li>
              <i
                className="fa-solid fa-user"
                onClick={() => (token ? navigate("/user") : navigate("/login"))}
              ></i>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;
