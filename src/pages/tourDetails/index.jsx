import React, { useEffect, useState } from 'react'
import './style.scss'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { get } from '../../utils/axios-http/axios-http';
import { Calendar, Collapse, theme } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import ImageSlider from './imageSlider';
import Map from '../../assets/images/map.png'
import Eat from '../../assets/images/eat.png'
import Friend from '../../assets/images/friend.png'
import Time from '../../assets/images/time2.png'
import Oto from '../../assets/images/oto.png'
import Sale from '../../assets/images/sale.png'
import Code from '../../assets/images/code.png'
import Vitri from '../../assets/images/vitri.png'
import Calenda from '../../assets/images/celanda.png'
import Time2 from '../../assets/images/time.png'
import Concho from '../../assets/images/concho.png'

const { Panel } = Collapse;

function TourDetails() {
    const { slug } = useParams();
    const [tourDetails, setTourDetails] = useState([]);
    const [showImageSlider, setShowImageSlider] = useState(false);
    const [departureDates, setDepartureDates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await get(`tours/detail/${slug}`)
            setTourDetails(response);
            const dates = response?.tour?.tourDetail?.map(detail => detail.dayStart) || [];
            setDepartureDates(dates);
        }
        fetchData();
    }, [slug]);
    const dateCellRender = (value) => {
        const formattedDate = value.format('YYYY-MM-DD');
        if (departureDates.includes(formattedDate)) {
            return (
                <div style={{ textAlign: 'center', color: '#fff', backgroundColor: '#1890ff', borderRadius: '50%' }}>
                    Ngày khởi hành
                </div>
            );
        }
        return null;
    };
    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };
    const { token } = theme.useToken();
    const panelStyle = {
        marginBottom: 22,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };
    const scheduleItems =
        tourDetails?.tour?.schedule?.map((item) => ({
            key: item.id,
            label: `Ngày ${item.day}: ${item.title}`,
            children: <p>{item.information}</p>,
            style: panelStyle
        })) || [];


    return (
        <div className='tour-details'>
            <div className="tour-details-main">
                <div className="tour-details-container">
                    <div className="tour-details-header">
                        <div className="tour-header-content">
                            <div className="breadcrumb-container">
                                <p className='p1' style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Du lịch / </p>
                                <p className='p2'> {tourDetails?.tour?.title}</p>
                            </div>
                            <h2>{tourDetails?.tour?.title}</h2>
                        </div>
                    </div>
                    <div className="tour-detail-content-container">
                        <div className="tour-detail-content">
                            <div className="tour-detail-content-left">
                                <div className="image-gallery">
                                    <div className="image-gallery-wrapper">
                                        <div className="image-thumbnails" >
                                            {tourDetails?.tour?.images?.map((item, key) => (
                                                <div className="thumnails-animate" onClick={() => setShowImageSlider(true)} key={key}>
                                                    <img src={item.source} alt="" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="image-main" onClick={() => setShowImageSlider(true)}>
                                            <img src={tourDetails?.tour?.images?.[0]?.source} alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="tour-calendar">
                                    <div className="section-detail">
                                        <h3>Lịch khởi hành</h3>
                                        <div className="calendar">
                                            <Calendar dateCellRender={dateCellRender} />
                                        </div>
                                    </div>
                                </div>
                                <div className="overview">
                                    <div className="section-detail">
                                        <h3 className='title'>Thông tin thêm về chuyến đi</h3>
                                        <div className="overview-content">
                                            <div className="overview-content-item">
                                                <img src={Map} alt="" />
                                                <h3>Điểm tham quan</h3>
                                                <p>{tourDetails?.tour?.information?.attractions}</p>
                                            </div>
                                            <div className="overview-content-item">
                                                <img src={Eat} alt="" />
                                                <h3>Ẩm thực</h3>
                                                <p>{tourDetails?.tour?.information?.cuisine}</p>
                                            </div>
                                            <div className="overview-content-item">
                                                <img src={Friend} alt="" />
                                                <h3>Đối tượng thích hợp</h3>
                                                <p>{tourDetails?.tour?.information?.suitableObject}</p>
                                            </div>
                                            <div className="overview-content-item">
                                                <img src={Time} alt="" />
                                                <h3>Thời gian lý tưởng</h3>
                                                <p>{tourDetails?.tour?.information?.idealTime}</p>
                                            </div>
                                            <div className="overview-content-item">
                                                <img src={Oto} alt="" />
                                                <h3>Phương tiện</h3>
                                                <p>{tourDetails?.tour?.information?.vehicle}</p>
                                            </div>
                                            <div className="overview-content-item">
                                                <img src={Sale} alt="" />
                                                <h3>Khuyến mãi</h3>
                                                <p>{tourDetails?.tour?.information?.promotion}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="schedule">
                                    <div className="section-detail">
                                        <h3 className='title'>
                                            Lịch trình
                                        </h3>
                                        <Collapse className='collapse' items={scheduleItems} accordion style={{ width: '100%', margin: 'auto', background: token.colorBgContainer }}
                                            bordered={false}
                                            defaultActiveKey={[]}
                                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                        >
                                        </Collapse>
                                    </div>
                                </div>
                            </div>
                            <div className="tour-detail-content-right">
                                <div className="tour-detail-booking">
                                    <div className="border-shadow">
                                        <div className="tour-price">
                                            <div className="price-oldPrice">
                                                <h4>Giá:</h4>
                                                <div className="price-discount">
                                                    <p><span>6.490.000 đ</span> / Khách</p>
                                                </div>
                                            </div>
                                            <div className="price">
                                                <p>5.990.000 đ <span>/ Khách</span></p>
                                            </div>
                                        </div>
                                        <div className="tour-price-info">
                                            <div className="tour-price-info-content">
                                                <div className="item">
                                                    <div className="label">
                                                        <img src={Code} alt="" />
                                                        <p>Mã tour: <span>{tourDetails?.tour?.code}</span></p>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="label">
                                                        <img src={Vitri} alt="" />
                                                        <p>Khởi hành: <span>{tourDetails?.tour?.departure}</span></p>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="label">
                                                        <img src={Calenda} alt="" />
                                                        <p>Ngày khởi hành: <span>31-12-2024</span></p>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="label">
                                                        <img src={Time2} alt="" />
                                                        <p>Thời gian: <span>4N3Đ</span></p>
                                                    </div>
                                                </div>
                                                <div className="item">
                                                    <div className="label">
                                                        <img src={Concho} alt="" />
                                                        <p>Số chỗ còn <span>9 chỗ</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="book-tour-option">
                                            <button className='btn-advise'>Ngày khác</button>
                                            <button className='btn-bookTour' onClick={() => navigate('/order', { state: { tourDetails } })}>
                                                Đặt tour
                                            </button>
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
            </div>
            {showImageSlider && (
                <div className='overlay' onClick={() => setShowImageSlider(false)}>
                    <motion.div
                        className='note-container'
                        onClick={(e) => e.stopPropagation()}
                        animate={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ImageSlider image={tourDetails?.tour?.images} onCancel={() => setShowImageSlider(false)} />
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default TourDetails