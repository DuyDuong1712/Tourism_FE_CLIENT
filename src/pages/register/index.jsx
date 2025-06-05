import React from 'react'
import './style.scss'
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/vtv-logo.png'
import { register } from '../../api/auth';

function Register() {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async () => {
        try {
            const values = form.getFieldsValue();
            const response = await register(values);
            if (response) {
                message.success("Tạo tài khoản thành công!");
                navigate('/login');
            }
            else {
                message.error(response?.message || "Đăng ký thất bại!")
            }
        }
        catch (error) {
            console.error(error);
            message.error("Đăng ký thất bại! Hãy thử lại.")
        }
    }
    return (
        <div className='register-page'>
            <div className="register-image">
                <img src={Logo} alt="" />
            </div>
            <div className="register-wrapper">
                <Form
                    form={form}
                    onFinish={onFinish}
                    className='register-form'
                >
                    <h1>Đăng ký</h1>
                    <div className="input-form">
                        <p>Full name <span>*</span></p>
                        <Form.Item
                            name="fullName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Thông tin bắt buộc',
                                },
                            ]}
                        >
                            <Input className='input' placeholder='Tên đầy đủ' />
                        </Form.Item>
                    </div>
                    <div className="input-form">
                        <p>Email <span>*</span></p>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Thông tin bắt buộc',
                                },
                            ]}
                        >
                            <Input className='input' placeholder='Nhập email của bạn!' />
                        </Form.Item>
                    </div>
                    <div className="input-form">
                        <p>Mật khẩu <span>*</span></p>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Thông tin bắt buộc',
                                },
                            ]}
                        >
                            <Input.Password className='input' placeholder='Nhập mật khẩu' />
                        </Form.Item>
                    </div>
                    <div className="input-form">
                        <p>Địa chỉ <span>*</span></p>
                        <Form.Item
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Thông tin bắt buộc',
                                },
                            ]}
                        >
                            <Input className='input' placeholder='Nhập địa chỉ của bạn' />
                        </Form.Item>
                    </div>
                    <div className="input-form">
                        <p>Số điện thoại <span>*</span></p>
                        <Form.Item
                            name="phoneNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Thông tin bắt buộc',
                                },
                            ]}
                        >
                            <Input className='input' placeholder='Nhập số điện thoại của bạn' />
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button className='button' type="primary" htmlType="submit">
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Register