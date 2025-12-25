import React, { useState } from "react";
// Assuming you copied the CSS file
import "./AdminRegister.css";
// No need for axios import if using a service function
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// <-- CHANGE 1: Import the new admin-specific registration service
import { registerAdmin } from "../../services/authService";

const AdminRegister = () => {
  // <-- CHANGE 2: Renamed component for clarity
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // <-- CHANGE 3: Call the admin-specific registration service
      const response = await registerAdmin(data);

      if (response.status === 201) {
        toast.success("Admin registration successful! Please log in.");
        // <-- CHANGE 4: Navigate to the admin login page
        navigate("/admin/login");
      } else {
        toast.error("Unable to register admin. Please try again.");
      }
    } catch (error) {
      console.error("ADMIN REGISTRATION ERROR:", error.response || error);
      toast.error("Registration failed. Email might already be in use.");
    }
  };

  return (
    <div className="register-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Admin Sign Up {/* <-- CHANGE 5: Updated Title */}
              </h5>
              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="Admin Name"
                    name="name"
                    onChange={onChangeHandler}
                    value={data.name}
                    required
                  />
                  <label htmlFor="floatingName">Admin Full Name </label>{" "}
                  {/* <-- CHANGE 6: Updated Label */}
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="admin@example.com"
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                    required
                  />
                  <label htmlFor="floatingInput">Admin Email address</label>{" "}
                  {/* <-- CHANGE 7: Updated Label */}
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    onChange={onChangeHandler}
                    value={data.password}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-outline-primary btn-login text-uppercase "
                    type="submit"
                  >
                    Register as Admin
                  </button>
                  <button
                    className="btn btn-outline-danger btn-login text-uppercase mt-2 "
                    type="reset"
                  >
                    Reset
                  </button>
                </div>
                <div className="mt-4">
                  Already have an admin account?{" "}
                  <Link to="/admin/login">Sign In</Link>{" "}
                  {/* <-- CHANGE 8: Updated link */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister; // <-- CHANGE 9: Export the new component name
