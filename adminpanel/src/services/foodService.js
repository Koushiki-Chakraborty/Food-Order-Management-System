import axios from "axios";

const API_URL = "http://localhost:8080/api/foods";

const getAuthHeaders = () => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    console.error("Authentication token not found.");
    return {};
  }
  return {
    Authorization: `Bearer ${adminToken}`,
  };
};

export const addFood = async (foodData, image) => {
  const formData = new FormData();
  formData.append("food", JSON.stringify(foodData));
  formData.append("file", image);

  try {
    await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeaders(),
      },
    });
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export const getFoodList = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error) {
    console.log("Error fetching food list:", error);
    throw error;
  }
};

export const deleteFood = async (foodId) => {
  try {
    const response = await axios.delete(API_URL + "/" + foodId, {
      headers: getAuthHeaders(),
    });

    return response.status === 204 || response.status === 200;
  } catch (error) {
    console.log("Error deleting food item:", error);
    throw error;
  }
};
