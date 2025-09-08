import axios from 'axios';

export const BASE_URL = "http://134.185.99.89:8080";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

//요청인터셉터 
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log("✅ access 토큰 전달됨:", token);
  }
    return config;
  }
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if(err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const loginRes = await axios.post(`${BASE_URL}/login`, {
          "username":"010-1234-1234",
          "password": "1234"
        }, {
          withCredentials: true,
        });

        const authHeader = loginRes.headers["authorization"];
        const newAccessToken = authHeader?.split(" ")[1];

        if (newAccessToken) {
          sessionStorage.setItem("access", newAccessToken);
          originalRequest.headers["access"] = newAccessToken;
          return api(originalRequest);
        } else {
          throw new Error("AccessToken 포함되지 않음");
        }
      } catch (e) {
        console.error("로그인 실패", e);
        sessionStorage.removeItem("access");
        window.location.href="/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;