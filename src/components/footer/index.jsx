import React from "react";
import "./style.scss";
import BCT from "../../assets/images/bct.png";
import DMCA from "../../assets/images/DMCA.png";
import Visa from "../../assets/images/visa.png";
import Mastercard from "../../assets/images/mastercard.png";
import VNPay from "../../assets/images/vnpay.png";
import verifiedByVisa from "../../assets/images/verifiedByVisa.png";
import shopeePay from "../../assets/images/shopeePay.png";
import JCB from "../../assets/images/JCB.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="">
          <h3>Liên hệ</h3>
          <p>190 Pasteur, Phường Võ Thị Sáu, Quận 3, TP.HCM</p>
          <p>(+84 28) 3822 8898</p>
          <p>(+84 28) 3829 9142</p>
          <p>info@vietravel.com</p>
          <div className="footer__social">
            <a href="https://www.instagram.com/vietravel">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com/vietravel">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="https://invite.viber.com/?g2=AQB8wC0DUgDueEuLGo5BAeemjjx4ry%2Fe5vhdAApryxsvJron7Hxr0xmLNk%2FISS2j&lang=vi">
              <i className="fa-solid fa-phone"></i>
            </a>
            <a href="https://www.tiktok.com/@vietravelofficial">
              <i className="fa-brands fa-tiktok"></i>
            </a>
            <a href="https://www.facebook.com/messages/t/181053065281290">
              <i className="fa-brands fa-facebook-messenger"></i>
            </a>
          </div>
          <div className="footer__hotline">
            <a href="tel:1800646888">1800 646 888</a>
          </div>
          <p className="footer__hours">Từ 8:00 - 23:00 hàng ngày</p>
        </div>
        <div className="">
          <h3>Thông tin</h3>
          <div className="footer__info">
            <a href="#">Khảo sát tỷ lệ đặt visa</a>
            <a href="#">Tạp chí du lịch</a>
            <a href="#">Tin tức</a>
            <a href="#">Sitemap</a>
            <a href="#">Trợ giúp</a>
            <a href="#">Chính sách riêng tư</a>
            <a href="#">Thỏa thuận sử dụng</a>
            <a href="#">Chính sách bảo vệ dữ liệu cá nhân</a>
          </div>
        </div>
        <div className="">
          <h3>Chứng nhận</h3>
          <div className="footer__certification">
            <img src={BCT} alt="Đã thông báo" />
            <img src={DMCA} alt="DMCA Protected" />
          </div>
        </div>
        <div className="">
          <h3>Chấp nhận thanh toán</h3>
          <div className="footer__payment-methods">
            <img src={Visa} alt="Visa" />
            <img src={Mastercard} alt="MasterCard" />
            <img src={VNPay} alt="VNPay" />
            <img src={verifiedByVisa} alt="verifiedByVisa" />
            <img src={JCB} alt="JCB" />
            <img src={shopeePay} alt="shopeePay" />
          </div>
        </div>
      </div>
    </footer>

    // <div className="footer">
    //   <div className="footer-container">
    //     <div className="footer-content">
    //       <div className="footer-colum">
    //         <h2>Du lịch trong nước</h2>
    //         <div className="footer-option">
    //           <div className="tour-item">
    //             <a href="">Hà Nội</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Hạ Long</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Huế</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Quảng Bình</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Đà Nẵng</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Quãng Nam</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Nha Trang</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Đà lạt</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Phan Thiết</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Bà Rịa - Vũng Tàu</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Phú Quốc</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Cần Thơ</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Bắc Kạn</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Hà Giang</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Quy Nhơn</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Côn Đảo</a>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="footer-colum">
    //         <h2>Du lịch nước ngoài</h2>
    //         <div className="footer-option">
    //           <div className="tour-item">
    //             <a href="">Hà Nội</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Hạ Long</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Huế</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Quảng Bình</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Đà Nẵng</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Quãng Nam</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Nha Trang</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Đà lạt</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Phan Thiết</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Bà Rịa - Vũng Tàu</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Phú Quốc</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Cần Thơ</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Bắc Kạn</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Hà Giang</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Quy Nhơn</a>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">Côn Đảo</a>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="footer-booking">

    //         <div className="footer-booking-content">
    //           <div className="footer-booking-colum">
    //             <h2>Dòng tour</h2>
    //             <div className="footer-booking-option">
    //               <div className="booking-item">
    //                 <a href="">Cao cấp</a>
    //               </div>
    //               <div className="booking-item">
    //                 <a href="">Tiết kiệm</a>
    //               </div>
    //               <div className="booking-item">
    //                 <a href="">Tiêu chuẩn</a>
    //               </div>
    //               <div className="booking-item">
    //                 <a href="">Giá tốt</a>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="footer-booking-colum">
    //             <h2>Dịch vụ lẻ</h2>
    //             <div className="footer-booking-option">
    //               <div className="booking-item">
    //                 <a href="">Vé máy bay</a>
    //               </div>
    //               <div className="booking-item">
    //                 <a href="">Khách sạn</a>
    //               </div>
    //               <div className="booking-item">
    //                 <a href="">Combo du lịch</a>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="footer-booking-colum">
    //             <h2>Ứng dụng di động</h2>
    //             <div className="footer-booking-qr">
    //               <img src={Qr1} alt="" />
    //               <img src={Qr2} alt="" />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="footer-content">
    //       <div className="footer-colum">
    //         <h2>Liên hệ</h2>
    //         <div className="footer-options">
    //           <div className="tour-item">
    //             <p>190 Pasteur, Phường Võ Thị Sáu, Quận 3, TP.HCM</p>
    //           </div>
    //           <div className="tour-item">
    //             <p>(+84 28) 3822 8898</p>
    //           </div>
    //           <div className="tour-item">
    //             <p>(+84 28) 3829 9142</p>
    //           </div>
    //           <div className="tour-item">
    //             <a href="">info@vietravel.com</a>
    //           </div>
    //           <div className="tour-icon">
    //             <a href="https://www.instagram.com/vietravel">
    //               <i className="fa-brands fa-instagram"></i>
    //             </a>
    //             <a href="https://www.facebook.com/vietravel">
    //               <i className="fa-brands fa-facebook"></i>
    //             </a>
    //             <a href="https://invite.viber.com/?g2=AQB8wC0DUgDueEuLGo5BAeemjjx4ry%2Fe5vhdAApryxsvJron7Hxr0xmLNk%2FISS2j&lang=vi">
    //               <i className="fa-solid fa-phone"></i>
    //             </a>
    //             <a href="https://www.tiktok.com/@vietravelofficial">
    //               <i className="fa-brands fa-tiktok"></i>
    //             </a>
    //             <a href="https://www.facebook.com/messages/t/181053065281290">
    //               <i className="fa-brands fa-facebook-messenger"></i>
    //             </a>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Footer;
