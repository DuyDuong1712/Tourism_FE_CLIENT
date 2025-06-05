import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import Logo from "../../assets/images/logo.png";
import { useSelector } from "react-redux";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("accessToken");

  return (
    <div className="header">
      <div className="header-image">
        <img src={Logo} alt="" onClick={() => navigate("/")} />
      </div>
      <div className="header-menu">
        <nav>
          <ul>
            <li>
              <a href="">Điểm đến</a>
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
