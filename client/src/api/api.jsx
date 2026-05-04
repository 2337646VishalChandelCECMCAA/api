import axios from "axios";

const API = axios.create({
  baseURL: "https://api-5bqv.onrender.com"
});

// 🔥 interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;