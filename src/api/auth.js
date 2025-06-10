import axios from "axios";

// const baseUrl =
//     import.meta.env.VITE_APP_URL_BE;

const baseUrl = "http://localhost:8080/travel/api/auth";

export const login = async (data) => {
    try {
        const {
            username,
            password
        } = data;

        const response = await axios.post(`${baseUrl}/login`, {
            username,
            password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                // Nếu có token hoặc thông tin người dùng đã đăng nhập trước, bạn có thể thêm Authorization ở đây
                // 'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        const token = response.data.data.token;
        console.log(token);

        if (token) {
            localStorage.setItem("accessToken", token);
        }
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Đã có lỗi khi đăng nhập. Vui lòng thử lại!');
    }
};

export const register = async (data) => {
    try {
        const {
            fullname,
            username,
            email,
            password,
            phone
        } = data;
        const response = await axios.post(`${baseUrl}/register`, {
            fullname,
            username,
            email,
            password,
            phone
        })
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
        // throw new Error('Tạo tài khoản không thành công. Vui lòng thử lại!');
    }
}

export const logout = async () => {
    try {
        const token = localStorage.getItem('accessToken'); // Lấy refreshToken nếu có

        await axios.post(`${baseUrl}/logout`, {
            token: token
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken') // Có thể cần hoặc không
            }
        });

        // Xóa token khỏi localStorage
        localStorage.removeItem("accessToken");

        console.log('Đăng xuất thành công');
    } catch (error) {
        console.error('Lỗi khi đăng xuất', error);
        throw new Error('Đã có lỗi khi đăng xuất. Vui lòng thử lại!');
    }
}