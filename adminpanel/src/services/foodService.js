import api from "../api/axiosConfig";

const FOODS_ENDPOINT = "/foods";

const API_URL = "http://localhost:8080/api/foods";

export const addFood = async (foodData, image) => {
  const formData = new FormData();
  formData.append("food", JSON.stringify(foodData));
  formData.append("file", image);

  try {
    const response = await api.post(FOODS_ENDPOINT, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding food:", error);
    throw error;
  }
};

export const getFoodList = async () => {
  try {
    const response = await api.get(FOODS_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching food list:", error);
    throw error;
  }
};

export const deleteFood = async (foodId) => {
  try {
    const response = await api.delete(`${FOODS_ENDPOINT}/${foodId}`);
    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.error("Error deleting food item:", error);
    throw error;
  }
};
