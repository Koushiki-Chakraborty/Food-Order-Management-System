import React, { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyPayment = () => {
  const { token, clearCart } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // This is the logic you wanted to move
  const verify = async () => {
    const success = searchParams.get("success") === "true";
    const orderId = searchParams.get("orderId");

    if (!token || !orderId) {
      navigate("/"); // Not enough info, go home
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/orders/confirm",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Payment successful!");
      clearCart();
    } catch (err) {
      console.error("Payment verification failed:", err);
      toast.error("Failed to verify payment.");
    } finally {
      // After trying to confirm, always go to the My Orders page
      navigate("/myorders");
    }
  };

  useEffect(() => {
    // Wait for the token to be loaded before running
    if (token) {
      verify();
    }
  }, [token, searchParams]); // Run when token is available

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
