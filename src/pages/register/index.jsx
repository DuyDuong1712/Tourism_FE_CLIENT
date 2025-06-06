import React, { useState } from "react";
import "./style.scss";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/vtv-logo.png";
import { register } from "../../api/auth";

function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      const { confirmPassword, ...registerData } = values;

      const response = await register(registerData);
      if (response) {
        message.success("Tạo tài khoản thành công!");
        navigate("/login");
      } else {
        message.error(response?.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error(error);
      message.error("Đăng ký thất bại! Hãy thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-image">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="register-wrapper">
        <Form form={form} onFinish={onFinish} className="register-form">
          <h1>Đăng ký</h1>

          {/* Username */}
          <div className="input-form">
            <p>
              Tên đăng nhập <span>*</span>
            </p>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Tên đăng nhập là bắt buộc!" },
                { min: 4, message: "Ít nhất 4 ký tự!" },
              ]}
            >
              <Input className="input" placeholder="Nhập tên đăng nhập" />
            </Form.Item>
          </div>

          {/* Full Name */}
          <div className="input-form">
            <p>
              Họ và tên <span>*</span>
            </p>
            <Form.Item
              name="fullname"
              rules={[
                { required: true, message: "Họ và tên là bắt buộc!" },
                { min: 2, message: "Họ và tên quá ngắn!" },
              ]}
            >
              <Input className="input" placeholder="Nhập họ và tên của bạn" />
            </Form.Item>
          </div>

          {/* Email */}
          <div className="input-form">
            <p>
              Email <span>*</span>
            </p>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email là bắt buộc!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input className="input" placeholder="Nhập email của bạn" />
            </Form.Item>
          </div>

          {/* Password */}
          <div className="input-form">
            <p>
              Mật khẩu <span>*</span>
            </p>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Mật khẩu là bắt buộc!" },
                { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
              ]}
              hasFeedback
            >
              <Input.Password className="input" placeholder="Nhập mật khẩu" />
            </Form.Item>
          </div>

          {/* Confirm Password */}
          <div className="input-form">
            <p>
              Nhập lại mật khẩu <span>*</span>
            </p>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password
                className="input"
                placeholder="Nhập lại mật khẩu"
              />
            </Form.Item>
          </div>

          {/* Phone Number */}
          <div className="input-form">
            <p>
              Số điện thoại <span>*</span>
            </p>
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Số điện thoại là bắt buộc!" },
                {
                  pattern: /^[0-9]{9,11}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input
                className="input"
                placeholder="Nhập số điện thoại của bạn"
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              className="button"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Register;
