import PropTypes from "prop-types";
import "./style.scss";
import { Carousel } from "antd";

function ImageSlider({ image, onCancel }) {
  const contentStyle = {
    margin: 0,
    width: "100% !important", // Chiếm toàn bộ chiều ngang
    height: "100% !important",
    display: "flex !important",
    objectFit: "contain",
    justifyContent: "center",
    alignItems: "center",
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
                <div
                  key={index}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    className="img"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    src={item?.imageUrl}
                    alt={`Hình ảnh ${index + 1}`}
                  />
                </div>
              ))
            ) : (
              <div>
                <img
                  className="img"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  src="../../assets/images/no-image.png"
                  alt={`Hình ảnh`}
                />
              </div>
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
