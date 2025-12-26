import { createContext } from "react";
import { useState, useEffect } from "react";
import { fetchFoodList } from "../service/FoodService";
import {
  addToCart,
  getCartData,
  removeQtyFromCart,
  deleteFromCart,
} from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");

  const increaseQty = async (foodId) => {
    setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
    if (token) {
      await addToCart(foodId);
    }
  };

  const decreaseQty = async (foodId) => {
    if (quantities[foodId] > 0) {
      setQuantities((prev) => ({
        ...prev,
        [foodId]: prev[foodId] - 1,
      }));
      if (token) {
        await removeQtyFromCart(foodId);
      }
    }
  };

  const removeFromCart = async (foodId) => {
    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[foodId];
      return updatedQuantities;
    });

    if (token) {
      await deleteFromCart(foodId);
    }
  };

  const loadCartData = async () => {
    try {
      const items = await getCartData();
      setQuantities(items || {});
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  };

  const clearCart = () => {
    setQuantities({});
  };

  const contextValue = {
    foodList,
    increaseQty,
    decreaseQty,
    quantities,
    removeFromCart,
    token,
    setToken,
    setQuantities,
    loadCartData,
    clearCart,
    user,
    setUser,
  };

  useEffect(() => {
    async function loadData() {
      const data = await fetchFoodList();
      setFoodList(data);

      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken) {
        setToken(savedToken);

        try {
          const items = await getCartData();
          setQuantities(items || {});
        } catch (err) {
          console.error("Initial cart load failed", err);
        }
      }

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing saved user", e);
        }
      }
    }
    loadData();
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
