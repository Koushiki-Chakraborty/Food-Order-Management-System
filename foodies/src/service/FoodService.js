import api from "../api/axiosConfig";

const FOODS_URL = "/foods";

export const fetchFoodList = async () => {
  try {
    const response = await api.get(FOODS_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching food list:", error);
    throw error;
  }
};

export const fetchFoodDetails = async (id) => {
  try {
    const response = await api.get(`${FOODS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching food details:", error);
    throw error;
  }
};
