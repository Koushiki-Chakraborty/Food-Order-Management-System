import api from "../api/axiosConfig";

const API_URL = "http://localhost:8080/api";

export const registerUser = async (data) => {
  return await api.post("/register", data);
};

export const login = async (data) => {
  const response = await api.post("/login", data);
  if (response.data && response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userEmail", data.email);
  }
  return response;
};
