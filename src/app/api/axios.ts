import axios from "axios";

const DEFAULT_PATH = "http://localhost:8000/api/";

let token: string | null = null;

export const setAccessToken = (accessToken: string) => {
  token = accessToken;
};

const axiosInstance = axios.create({
  baseURL: DEFAULT_PATH,
  timeout: 5000, // Set to 5 seconds (or any other time)
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
