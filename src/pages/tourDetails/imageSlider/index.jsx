import React from 'react'
import './style.scss'
import { Carousel } from 'antd';


function ImageSlider({ image, onCancel }) {
    const contentStyle = {
        margin: 0,
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };
    return (
        <div className='image-slider'>
            <div className="image-slider-close">
                <i className="fa-solid fa-xmark" onClick={onCancel}></i>
            </div>
            <div className="image-slider-body">
                <div className="image">
                    <Carousel arrows infinite={false}>
                        {image.map((item) => (
                            <img className='img' style={contentStyle} src={item?.source} alt="" />
                        ))}
                    </Carousel>
                </div>

            </div>
        </div>
    )
}

export default ImageSlider