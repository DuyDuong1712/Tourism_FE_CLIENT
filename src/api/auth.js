import axios from "axios";

// const baseUrl =
//     import.meta.env.VITE_APP_URL_BE;

const baseUrl = "http://localhost:8080/travel/api/auth";

// Tạo instance axios riêng để có thể thêm interceptor
const axiosInstance = axios.create();

// Thêm interceptor để tự động refresh token
//Interceptor này được gọi trước khi request được gửi đi, dùng để:
// Gắn Authorization: Bearer < token > vào header.
// Nếu token sắp hết hạn(còn < 5 phút), thì gọi API / refresh để lấy token mới.
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            // Kiểm tra token có sắp hết hạn không (ví dụ: còn 5 phút)
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();

            // Nếu token còn 5 phút nữa hết hạn thì refresh
            if (expirationTime - currentTime < 5 * 60 * 1000) {
                try {
                    const response = await axios.post(`${baseUrl}/refresh`, {
                        token: token
                    });
                    const newToken = response.data.data.token;
                    localStorage.setItem("accessToken", newToken);
                    config.headers.Authorization = `Bearer ${newToken}`;
                } catch (error) {
                    console.error('Lỗi khi refresh token:', error);
                    localStorage.removeItem("accessToken");
                    window.location.href = '/login';
                }
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


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
    }
}

export const logout = async () => {
    try {
        const token = localStorage.getItem('accessToken'); // Lấy refreshToken nếu có

        await axios.post(`${baseUrl}/logout`, {
            token: token
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
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