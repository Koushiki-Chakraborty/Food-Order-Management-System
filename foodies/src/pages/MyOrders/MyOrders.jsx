import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import "./MyOrders.css";
import { calculateCartTotals } from "../../util/cartUtils";
import * as bootstrap from "bootstrap";

const MyOrders = () => {
  const { token, foodList, increaseQty } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    if (token) {
      try {
        const response = await axios.get("http://localhost:8080/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data.reverse());
      } catch (error) {
        console.error("Could not fetch orders:", error);
        toast.error("Could not fetch orders.");
      }
    }
  };

  const viewDetails = (order) => {
    const quantities = {};

    const cartItems = order.orderedItems
      .filter((item) => item.quantity > 0)
      .map((item) => {
        quantities[item.foodId] = item.quantity;

        const catalogItem = foodList.find((f) => f.id === item.foodId);
        const price = item.price > 0 ? item.price : catalogItem?.price || 0;

        return { ...item, id: item.foodId, price };
      });

    const breakdown = calculateCartTotals(cartItems, quantities);

    setSelectedOrder({
      ...order,
      orderedItems: cartItems,
      calculatedFees: breakdown,
    });
  };

  useEffect(() => {
    if (selectedOrder) {
      const orderModalEl = document.getElementById("orderDetailsModal");
      if (orderModalEl) {
        const orderModal = new bootstrap.Modal(orderModalEl);
        orderModal.show();
      }
    }
  }, [selectedOrder]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
      case "Delivered":
        return "border border-success text-success bg-light";
      case "Food Preparing":
      case "Out for Delivery":
        return "border border-primary text-primary bg-light";
      case "Pending Payment":
      default:
        return "border border-warning text-warning bg-light";
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <h4 className="card-header">Your Order History</h4>
          <table className="table table-responsive table-hover">
            <thead>
              <tr className="text-center align-middle">
                <th style={{ width: "5%" }}></th>
                <th style={{ width: "3%" }} className="text-start">
                  Status
                </th>
                <th style={{ width: "41%" }} className="text-end">
                  Amount
                </th>
                <th style={{ width: "35%" }} className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((order, index) => {
                const itemCount =
                  order.orderedItems?.filter((item) => item.quantity > 0)
                    .length || 0;
                return (
                  <tr key={index} className=" align-middle">
                    <td className="text-center">
                      <img
                        src={assets.delivery}
                        alt="Delivery"
                        height={48}
                        width={48}
                      />
                    </td>
                    <td className="text-center">
                      <div
                        className={`fw-bold badge ${getStatusBadge(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </div>
                      <small className="text-muted d-block">
                        {itemCount} Item(s)
                      </small>
                    </td>
                    <td className="text-end">
                      <strong>&#x20B9; {order.amount.toFixed(2)}</strong>
                    </td>
                    <td className="text-end">
                      <div className="d-flex flex-column align-items-end">
                        <button
                          className="btn btn-sm btn-info text-white mb-2"
                          onClick={() => viewDetails(order)}
                        >
                          View Details
                        </button>
                        <button
                          className="btn btn-sm btn-danger text-white"
                          onClick={() => {
                            order.orderedItems
                              .filter((item) => item.quantity > 0)
                              .forEach((item) => {
                                for (let i = 0; i < item.quantity; i++) {
                                  increaseQty(item.foodId);
                                }
                              });
                            toast.success("Items added to cart!");
                          }}
                        >
                          Reorder
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ORDER DETAILS MODAL --- */}
      <div
        className="modal fade"
        id="orderDetailsModal"
        tabIndex="-1"
        aria-labelledby="orderDetailsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="orderDetailsModalLabel">
                Order Details - #{selectedOrder?.id?.substring(18) || "..."}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body p-4">
              {selectedOrder ? (
                <>
                  {/* Status Box */}
                  <div
                    className={`alert ${getStatusBadge(
                      selectedOrder.orderStatus
                    )} d-flex align-items-center mb-4`}
                  >
                    <i className="bi bi-info-circle-fill me-3 fs-4"></i>
                    <div>
                      <strong className="text-uppercase">Status:</strong>{" "}
                      {selectedOrder.orderStatus}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <h6 className="fw-bold text-primary">Delivery Address</h6>
                  <p className="border p-2 rounded">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    {selectedOrder.userAddress}
                  </p>
                  <p className="mb-0">
                    <strong>Phone:</strong> {selectedOrder.phoneNumber}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.email}
                  </p>

                  <h6 className="fw-bold text-primary mt-4">Item Breakdown</h6>
                  <ul className="list-group list-group-flush mb-2">
                    {selectedOrder.orderedItems
                      ?.filter((item) => item.quantity > 0)
                      .map((item, i) => (
                        <li
                          key={i}
                          className="list-group-item d-flex justify-content-between"
                        >
                          <span>
                            {item.quantity} x {item.name}
                          </span>
                          {/* Display price using the saved price from MongoDB */}
                          <span>
                            &#x20B9; {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                  </ul>

                  {/* Price Summary - Using Recalculated Fees */}
                  <div className="d-flex flex-column mb-4 p-2 rounded border">
                    <div className="d-flex justify-content-between text-muted">
                      <span>Subtotal</span>
                      <span>
                        &#x20B9;{" "}
                        {selectedOrder.calculatedFees.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between text-muted">
                      <span>Shipping Fee</span>
                      <span>
                        &#x20B9;{" "}
                        {selectedOrder.calculatedFees.shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between text-muted border-bottom mb-2">
                      <span>Tax (10%)</span>
                      <span>
                        &#x20B9; {selectedOrder.calculatedFees.tax.toFixed(2)}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between fw-bold pt-2 border-top">
                      <span>Grand Total</span>
                      <span>
                        &#x20B9; {selectedOrder.calculatedFees.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p>No order data available.</p>
              )}
            </div>

            <div className="modal-footer d-flex justify-content-between">
              <div>
                {selectedOrder?.orderStatus === "Out for Delivery" && (
                  <button
                    type="button"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                    onClick={() => navigate(`/track/${selectedOrder.id}`)}
                  >
                    <i className="bi bi-geo-alt-fill me-2"></i>Track Order
                  </button>
                )}
              </div>

              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
