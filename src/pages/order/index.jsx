import React, { useEffect, useState } from 'react'
import './style.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import Code from '../../assets/images/code.png'
import Vitri from '../../assets/images/vitri.png'
import Time from '../../assets/images/time.png'
import { getUser, post } from '../../utils/axios-http/axios-http'
import { message } from 'antd'

function Order() {
    const location = useLocation();
    const tourDetails = location.state?.tourDetails;
    const [user, setUser] = useState([]);
    const [userTT, setUserTT] = useState({});
    const [adultQuantity, setAdultQuantity] = useState(0);
    const [childrenQuantity, setChildrenQuantity] = useState(0);
    const [babyQuantity, setBabyQuantity] = useState(0);
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const response = await getUser('user/profile');
            setUser(response);
        }
        fetchData();
    }, []);

    const handleOrder = async () => {
        const orderData = {
            fullName: user?.user?.fullName,
            email: user?.user?.email,
            phoneNumber: user?.user?.phoneNumber,
            address: user?.user?.address,
            adultPrice: tourDetails?.tour?.tourDetail?.[0]?.adultPrice || 0,
            adultQuantity,
            childrenPrice: tourDetails?.tour?.tourDetail?.[0]?.childrenPrice || 0 || 0,
            childrenQuantity,
            babyPrice: tourDetails?.tour?.tourDetail?.[0]?.babyPrice || 0 || 0,
            babyQuantity,
            singleRoomSupplementPrice: 500000,
            singleRoomSupplementQuantity: 1,
            note,
            paymentMethod,
            tourDetailId: tourDetails?.tour?.tourDetail?.[0]?.id,
            userId: user?.user?.id,
        };
        console.log(orderData)

        try {
            const response = await post('orders/book-tour', orderData);
            if (response) {
                message.success('Đặt tour thành công!');
                navigate('/');
            }
        } catch (error) {
            console.error('Lỗi khi đặt tour:', error);
            message.error('Đặt tour thất bại! Vui lòng thử lại')
        }
    };
    const navigate = useNavigate();
    return (
        <div className='order'>
            <div className="order-header">
                <div className="order-header-content">
                    <button style={{ cursor: 'pointer' }} onClick={() => navigate(`/tour-details/${tourDetails?.tour?.slug}`)}><i className="fa-solid fa-arrow-left"></i> <span>Quay lại</span></button>
                    <h1>Đặt tour</h1>
                </div>
            </div>
            <div className="page-order">
                <div className="page-order-container">
                    <div className="page-order-left">
                        <div className="order-contact">
                            <h3>Thông tin liên lạc</h3>
                            <form action="">
                                <div className="booking-contact-row">
                                    <div className="linee-r">
                                        <div className="input-border">
                                            <label htmlFor="">Full name <span style={{ color: 'red' }}>*</span>:</label>
                                            <p>{user?.user?.fullName}</p>

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="input-border">
                                            <label htmlFor="">Điện thoại <span style={{ color: 'red' }}>*</span>:</label>
                                            <p>{user?.user?.phoneNumber}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="booking-contact-row">
                                    <div className="linee-r">
                                        <div className="input-border">
                                            <label htmlFor="">Email <span style={{ color: 'red' }}>*</span>:</label>
                                            <p>{user?.user?.email}</p>
                                        </div>

                                    </div>
                                    <div className="col">
                                        <div className="input-border">
                                            <label htmlFor="">Địa chỉ <span style={{ color: 'red' }}>*</span>:</label>
                                            <p>{user?.user?.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </form>
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
                                                        <input type="number" onChange={(e) => setAdultQuantity(Number(e.target.value))} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="false">
                                            <div className="wrapper">
                                                <div className="row">
                                                    <div className="type">
                                                        <p>Trẻ em</p>
                                                        <small>Từ 2-11 tuổi</small>
                                                    </div>
                                                    <div className="quantity">
                                                        <input type="number" onChange={(e) => setChildrenQuantity(Number(e.target.value))} />
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
                                                        <input type="number" onChange={(e) => setBabyQuantity(Number(e.target.value))} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-note">
                            <h3>Ghi chú</h3>
                            <span>Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi</span>
                            <div className="booking-note">
                                <textarea placeholder='Vui lòng nhập nội dung' onChange={(e) => setNote(e.target.value)}></textarea>
                            </div>
                        </div>
                        <div className="booking-item">
                            <h3>Các hình thức thanh toán</h3>
                            <input type="text" onChange={(e) => setPaymentMethod(e.target.value)} />
                        </div>
                    </div>
                    <div className="page-order-right">
                        <div className="sumary">
                            <h3>Tóm tắt chuyến đi</h3>
                            <div className="card">
                                <div className="card-header">
                                    <div className="image">
                                        <img src={tourDetails?.tour?.images?.[0]?.source} alt="" />
                                    </div>
                                    <div className="title-booking">
                                        <div className="row">
                                            <h4>{tourDetails?.tour?.title}</h4>
                                            <div className="title-booking">
                                                <img src={Code} alt="" />
                                                <span>Mã tour : </span>
                                                <span>HN004</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="preview">
                                    <div className="row">
                                        <img src={Vitri} alt="" />
                                        Khởi hành
                                        <span>Hà Nội</span>
                                    </div>
                                    <div className="row">
                                        <img src={Time} alt="" />
                                        Thời gian:
                                        <span>5N4Đ</span>
                                    </div>
                                </div>
                                <hr />
                                <div className="card-footer">
                                    <div className="totalPrice">
                                        <div className="left">Tổng tiền</div>
                                        <div className="right">14.990.000đ</div>
                                    </div>
                                    <button onClick={handleOrder}>Đặt tour</button>
                                </div>
                            </div>
                            <div className="tour-contact">
                                <div className="tour-contact-group">
                                    <button className='btn-phone'>
                                        <i className="fa-solid fa-phone-volume"></i>
                                        <p>Gọi miễn phí qua internet</p>
                                    </button>
                                    <button className='btn-mail'>
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
    )
}

export default Order