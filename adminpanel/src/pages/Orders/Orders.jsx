import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assests";

const Orders = () => {
  const [data, setData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State for modal data

  const fetchOrders = async () => {
    const response = await axios.get("http://localhost:8080/api/orders/all");
    setData(response.data);
  };

  const viewCustomerDetails = (order) => {
    setSelectedCustomer({
      name: order.userAddress.split(",")[0] || "N/A",
      address: order.userAddress,
      phone: order.phoneNumber,
      email: order.email,
    });
  };

  const updateStatus = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      const response = await axios.patch(
        `http://localhost:8080/api/orders/status/${orderId}`,

        { status: newStatus }
      );

      if (response.status === 200) {
        await fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <thead>
              <tr className="text-center">
                <th>Item</th>
                <th>Order Details</th>
                <th>Amount</th>
                <th>Items Count</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img src={assets.parcel} alt="" height={48} width={48} />
                    </td>
                    <td>
                      <div>
                        {order.orderedItems
                          ?.filter((item) => item.quantity > 0) // Filter 0-qty items
                          .map((item, index) => {
                            if (index === order.orderedItems.length - 1) {
                              return item.name + " X " + item.quantity;
                            } else {
                              return item.name + " X " + item.quantity + ", ";
                            }
                          })}
                      </div>
                      <button
                        className="btn btn-sm btn-primary mt-2"
                        onClick={() => viewCustomerDetails(order)}
                        data-bs-toggle="modal"
                        data-bs-target="#customerModal"
                      >
                        View Customer
                      </button>
                    </td>
                    <td>&#x20B9; {order.amount.toFixed(2)}</td>
                    <td className="text-center">
                      Items:{" "}
                      {order.orderedItems?.filter((item) => item.quantity > 0)
                        .length || 0}
                    </td>

                    <td>
                      <select
                        className="form-control text-center"
                        onChange={(event) => updateStatus(event, order.id)}
                        value={order.orderStatus}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Food Preparing">Food Preparing</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="fw-bold text-capitalize text-center">
                      &#x25cf; {order.orderStatus}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="modal fade"
        id="customerModal"
        tabIndex="-1"
        aria-labelledby="customerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="customerModalLabel">
                Customer Details
              </h5>
            </div>
            <div className="modal-body">
              {selectedCustomer ? (
                <>
                  <p>
                    <strong>Name:</strong> {selectedCustomer.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedCustomer.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedCustomer.phone}
                  </p>
                  <hr />
                  <p>
                    <strong>Delivery Address:</strong>{" "}
                    {selectedCustomer.address}
                  </p>
                </>
              ) : (
                <p>Loading customer information...</p>
              )}
            </div>
            <div className="modal-footer">
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

export default Orders;
