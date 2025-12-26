import api from "../api/axiosConfig";

const CART_URL = "/cart";

export const addToCart = async (foodId, token) => {
  try {
    await api.post(CART_URL, { foodId });
  } catch (error) {
    console.error("Error while adding the cart data", error);
    throw error;
  }
};

export const removeQtyFromCart = async (foodId, token) => {
  try {
    await api.post(`${CART_URL}/remove`, { foodId });
  } catch (error) {
    console.error("Error while removing qty from cart", error);
    throw error;
  }
};

export const getCartData = async (token) => {
  try {
    const response = await api.get(CART_URL);
    return response.data.items;
  } catch (error) {
    console.error("Error while fetching the cart data", error);
    throw error;
  }
};

export const deleteFromCart = async (foodId, token) => {
  try {
    await api.delete(`${CART_URL}/${foodId}`);
  } catch (error) {
    console.error("Error removing from cart", error);
    throw error;
  }
};
