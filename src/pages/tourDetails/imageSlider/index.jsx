import React from "react";
import PropTypes from "prop-types";
import "./style.scss";
import { Carousel } from "antd";

function ImageSlider({ image, onCancel }) {
  const contentStyle = {
    margin: 0,
    width: "100%",
    height: "100%", // Sử dụng 100% để khớp với SCSS
    objectFit: "contain",
  };

  return (
    <div className="image-slider">
      <div className="image-slider-close">
        <i className="fa-solid fa-xmark" onClick={onCancel}></i>
      </div>
      <div className="image-slider-body">
        <div className="image">
          <Carousel arrows infinite={false}>
            {image && Array.isArray(image) && image.length > 0 ? (
              image.map((item, index) => (
                <div key={index}>
                  <img
                    className="img"
                    style={contentStyle}
                    src={item?.imageUrl}
                    alt={`Hình ảnh ${index + 1}`}
                  />
                </div>
              ))
            ) : (
              <div>Không có hình ảnh để hiển thị</div>
            )}
          </Carousel>
        </div>
      </div>
    </div>
  );
}

ImageSlider.propTypes = {
  image: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      imageUrl: PropTypes.string,
    })
  ).isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ImageSlider;
