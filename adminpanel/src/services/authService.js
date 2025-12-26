import api from "../api/axiosConfig";

export const registerAdmin = async (data) => {
  try {
    // Use relative path since baseURL is in api
    const response = await api.post("/admin/auth/register", data);
    return response;
  } catch (error) {
    console.error("Error registering admin:", error);
    throw error;
  }
};

export const adminLogin = async (data) => {
  try {
    const response = await api.post("/admin/auth/login", data);

    if (response.data && response.data.token) {
      localStorage.clear();

      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminEmail", data.email);
    }
    return response;
  } catch (error) {
    console.error("Error logging in admin:", error);
    throw error;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");

  window.location.href = "/login";
};
