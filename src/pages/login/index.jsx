import React from "react";
import "./style.scss";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Logo from "../../assets/images/vtv-logo.png";
import { login } from "../../api/auth";
import { getUser } from "../../utils/axios-http/axios-http";
import { loginReducer } from "../../slice/authSlice";
import { GoogleLogin } from "@react-oauth/google";
// import jwt_decode from "jwt-decode"; // Để giải mã token

function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async () => {
    try {
      const values = form.getFieldValue();
      const response = await login(values);
      // const responseUser = await getUser("user/profile");
      // console.log(responseUser.user);

      if (response) {
        message.success("Đăng nhập thành công");
        // dispatch(loginReducer(responseUser.user));
        navigate("/");
      } else {
        message.error(response?.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error(error);
      message.error("Đăng nhập thất bại! Hãy thử lại.");
    }
  };
  return (
    <div className="login-page">
      <div className="login-image">
        <img src={Logo} alt="" />
      </div>
      <div className="login-wrapper">
        <Form form={form} onFinish={onFinish} className="login-form">
          <h1>Đăng nhập</h1>
          <div className="input-form">
            <p>
              username <span>*</span>
            </p>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Thông tin bắt buộc",
                },
              ]}
            >
              <Input className="input" placeholder="Nhập email!" />
            </Form.Item>
          </div>
          <div className="input-form">
            <p>
              Mật khẩu <span>*</span>
            </p>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Thông tin bắt buộc",
                },
              ]}
            >
              <Input.Password className="input" placeholder="Nhập mật khẩu!" />
            </Form.Item>
          </div>
          <div className="navigate">
            <p>
              Bạn chưa đăng ký?{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Đăng ký
              </span>
            </p>
          </div>
          <Form.Item>
            <Button className="button" type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </Form.Item>

          {/* Nút đăng nhập bằng Google */}
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const decoded = jwt_decode(
                    credentialResponse.credential || ""
                  );
                  console.log("Google user:", decoded);

                  // Nếu muốn gọi API để login bằng email Google:
                  // const response = await loginWithGoogle(decoded.email);
                  // dispatch(loginReducer(response.user));
                  // navigate("/");

                  message.success("Đăng nhập bằng Google thành công!");
                } catch (err) {
                  console.error(err);
                  message.error("Đăng nhập Google thất bại!");
                }
              }}
              onError={() => {
                message.error("Đăng nhập Google thất bại!");
              }}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
