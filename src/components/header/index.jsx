import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import Logo from "../../assets/images/logo.png";
import { useSelector } from "react-redux";
import { get } from "../../utils/axios-http/axios-http";

// Hàm tạo slug từ name
const generateSlug = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
    .replace(/[^a-z0-9]+/g, "-") // Thay ký tự đặc biệt bằng dấu gạch ngang
    .replace(/^-+|-+$/g, ""); // Xóa dấu gạch ngang ở đầu/cuối
};

// Component đệ quy hiển thị cây destination
// const DestinationTree = ({ data, onSelect }) => {
//   if (!data || data.length === 0) {
//     return <div className="no-destinations">Không có điểm đến</div>;
//   }

//   return (
//     <ul className="destination-tree">
//       {data.map((item) => (
//         <li key={item.id}>
//           <span
//             className="destination-title"
//             onClick={() => {
//               if (item.slug) {
//                 onSelect(item);
//               }
//             }}
//             style={{ cursor: item.slug ? "pointer" : "not-allowed" }}
//             title={!item.slug ? "Điểm đến này không có trang chi tiết" : ""}
//           >
//             {item.name || "Không có tên"}
//           </span>
//           {item.children && item.children.length > 0 && (
//             <DestinationTree data={item.children} onSelect={onSelect} />
//           )}
//         </li>
//       ))}
//     </ul>
//   );
// };

const DestinationTree = ({ data, onSelect }) => {
  if (!data || data.length === 0) {
    return <div className="no-destinations">Không có điểm đến</div>;
  }

  return (
    <div className="destination-columns">
      {data.map((region) => (
        <div className="destination-column" key={region.id}>
          <h4>{region.name}</h4>
          <ul>
            {region.children &&
              region.children.map((item) => (
                <li
                  key={item.id}
                  onClick={() => item.slug && onSelect(item)}
                  className={!item.slug ? "disabled" : ""}
                  title={!item.slug ? "Không có trang chi tiết" : ""}
                >
                  {item.name}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Hàm xây dựng cây từ danh sách phẳng
// const buildTree = (items) => {
//   if (!Array.isArray(items)) return [];

//   const map = {};
//   const tree = [];

//   // Thêm slug vào mỗi item
//   items.forEach((item) => {
//     if (item.id) {
//       map[item.id] = { ...item, slug: generateSlug(item.name), children: [] };
//     }
//   });

//   items.forEach((item) => {
//     if (item.id && item.parentId && map[item.parentId]) {
//       map[item.parentId].children.push(map[item.id]);
//     } else if (item.id) {
//       tree.push(map[item.id]);
//     }
//   });

//   return tree;
// };
const buildTree = (items) => {
  const map = {};
  const roots = [];

  items.forEach((item) => {
    map[item.id] = { ...item, slug: generateSlug(item.name), children: [] };
  });

  items.forEach((item) => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots;
};

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("accessToken");

  const [showDestMenu, setShowDestMenu] = useState(false);
  const [destTree, setDestTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const menuRef = useRef();

  // Lấy danh sách destination tree khi mở menu
  const handleOpenDestMenu = async () => {
    setShowDestMenu(true);
    if (destTree.length === 0) {
      setLoading(true);
      setError(null);
      try {
        const response = await get("destinations");
        const destinations = response.data;

        // Lọc bỏ các destination inActive nếu cần
        const activeDestinations = destinations.filter(
          (item) => !item.inActive
        );
        const tree = buildTree(
          activeDestinations.length > 0 ? activeDestinations : response.data
        );
        setDestTree(tree);
      } catch (err) {
        setError("Không thể tải danh sách điểm đến");
        console.error("Error fetching destinations:", err);
      } finally {
        setLoading(false);
      }
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
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDestMenu]);

  // Khi chọn 1 destination
  const handleSelectDestination = (item) => {
    setShowDestMenu(false);
    if (item.slug) {
      navigate(`/tours/${item.slug}`);
    } else {
      console.warn("Destination missing slug:", item);
    }
  };

  return (
    <div className="header">
      <div className="header-image">
        <img src={Logo} alt="Logo" onClick={() => navigate("/")} />
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
                    {loading && <div>Đang tải...</div>}
                    {error && <div className="error">{error}</div>}
                    {!loading && !error && (
                      <DestinationTree
                        data={destTree}
                        onSelect={handleSelectDestination}
                      />
                    )}
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
