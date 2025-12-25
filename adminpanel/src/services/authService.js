import axios from "axios";

const BASE_API_URL = "http://localhost:8080/api";

/**
 * Sends a request to the backend to register a new admin user.
 * @param {object} data - Object containing name, email, and password.
 * @returns {Promise<object>} The Axios response object.
 */
export const registerAdmin = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/admin/auth/register`, // <-- Target the new admin registration endpoint
      data
    );
    return response;
  } catch (error) {
    console.error("Error registering admin:", error);
    throw error;
  }
};

/**
 * Sends a request to the backend to log in an admin user.
 * @param {object} data - Object containing email and password.
 * @returns {Promise<object>} The Axios response object containing the JWT token.
 */
export const adminLogin = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_API_URL}/admin/auth/login`, // <-- Target the new admin login endpoint
      data
    );
    return response;
  } catch (error) {
    console.error("Error logging in admin:", error);
    throw error;
  }
};
