import axios from 'axios';

function createAxiosInstance(token: string | null) {
  const axiosInstance = axios.create({
    baseURL: process.env.REGISTRATION_API_URL, // Base URL from environment variable
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (token) {
    axiosInstance.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  return axiosInstance;
}

export { createAxiosInstance };
