/* eslint-disable */
import axios from 'axios';


const baseURL = "http://localhost:8080/travel/api";


const createAxiosInstance = (baseURL, headers = {}) => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Accept': 'application/json',
            ...headers,
        },
    });

    // Thêm interceptor để cập nhật token động
    instance.interceptors.request.use(
        async (config) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = tokenData.exp * 1000;
                const currentTime = Date.now();

                if (expirationTime - currentTime < 5 * 60 * 1000) {
                    try {
                        const response = await axios.post(`${baseURL}/auth/refresh`, { token });
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
        (error) => Promise.reject(error)
    );

    return instance;
};


// Instance dùng cho JSON
const token = localStorage.getItem('accessToken');
// console.log(token);

const axiosInstanceUser = createAxiosInstance(baseURL, {
    'Content-Type': 'application/json',
});


// Instance dùng chung
const axiosInstance = createAxiosInstance(baseURL);


// Hàm xử lý lỗi chung
const handleError = (error) => {
    console.error('Error:', error.response || error.message);
    throw error;
};


// User Profile
const getUser = async (path) => {
    try {
        const response = await axiosInstanceUser.get(`/${path}`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
// Phương thức POST
const postUser = async (path, data) => {
    try {
        const response = await axiosInstanceUser.post(`/${path}`, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Phương thức PATCH
const patchUser = async (path, data) => {
    try {
        const response = await axiosInstanceUser.patch(`/${path}`, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


// Phương thức GET

const get = async (path, params = {}) => {
    try {
        const response = await axiosInstance.get(`/${path}`, {
            params
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
// Phương thức POST
const post = async (path, data) => {
    try {
        const response = await axiosInstance.post(`/${path}`, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
// Phương thức POST
const postForm = async (path, data) => {
    try {
        const response = await axiosInstance.post(`/${path}`, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Phương thức PATCH
const patch = async (path, data) => {
    try {
        const response = await axiosInstance.patch(`/${path}`, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Phương thức PATCH với form data
const patchForm = async (path, data) => {
    try {
        const response = await axiosInstance.patch(`/${path}`, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Phương thức DELETE
const deleteMethod = async (path, data) => {
    try {
        const response = await axiosInstance.delete(`/${path}`, {
            data
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Xuất các phương thức để sử dụng ở nơi khác
export {
    get,
    post,
    postForm,
    patch,
    patchForm,
    deleteMethod,
    getUser,
    postUser,
    patchUser
};