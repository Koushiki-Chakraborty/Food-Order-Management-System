import React, { useEffect, useContext, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../api/axiosConfig";

const VerifyPayment = () => {
  const { token, clearCart } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hasRun = useRef(false);

  // This is the logic you wanted to move
  const verify = async () => {
    if (hasRun.current) return;

    const success = searchParams.get("success") === "true";
    const orderId = searchParams.get("orderId");

    if (!success) {
      toast.error("Payment cancelled or failed.");
      navigate("/cart");
      return;
    }

    if (!orderId) {
      navigate("/");
      return;
    }

    try {
      hasRun.current = true;
      // CHANGE: Using 'api' instance instead of 'axios' to use the interceptor
      await api.post("/orders/confirm", { orderId });

      toast.success("Payment successful!");
      clearCart();
      navigate("/myorders");
    } catch (err) {
      console.error("Payment verification failed:", err);
      toast.error("Failed to verify payment.");
      navigate("/");
    }
  };

  useEffect(() => {
    // CHANGE: Check localStorage directly for token persistence
    const storedToken = localStorage.getItem("token");
    if (token || storedToken) {
      verify();
    }
  }, [token]);

  // Show a simple loading spinner/message
  return (
    <div className="container text-center py-5" style={{ minHeight: "60vh" }}>
      <h2>Verifying Payment...</h2>
      <p>Please wait, we are confirming your order.</p>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default VerifyPayment;
