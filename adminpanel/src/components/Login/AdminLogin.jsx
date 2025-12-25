import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/authService";
import { toast } from "react-toastify";
import "./AdminLogin.css";

const AdminLogin = () => {
  // <-- CHANGE 2: Renamed component for clarity
  // Removed setToken, loadCartData, setUser from useContext
  const navigate = useNavigate();
  const [data, setData] = useState({
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
      // <-- CHANGE 3: Call the admin-specific login service
      const response = await adminLogin(data);

      if (response.status === 201 || response.status === 200) {
        // 1. Store the JWT Token (CRITICAL FOR AUTHENTICATION)
        const adminToken = response.data.token; // Assuming response is still { email: TOKEN, token: EMAIL }
        localStorage.setItem("adminToken", adminToken);
        localStorage.setItem("adminUserEmail", response.data.email);

        navigate("/");
        window.location.reload();
      } else {
        toast.error("Admin login failed. Check credentials.");
      }
    } catch (error) {
      console.log("ADMIN LOGIN ERROR:", error.response || error);
      toast.error("Invalid Admin Credentials or server error.");
    }
  };

  return (
    <div className="login-container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5">
                Admin Sign In {/* <-- CHANGE 7: Updated Title */}
              </h5>
              <form onSubmit={onSubmitHandler}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                    required
                  />
                  <label htmlFor="floatingInput">Admin Email</label>{" "}
                  {/* <-- CHANGE 8: Updated Label */}
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
                    Sign in as Admin
                  </button>
                  <button
                    className="btn btn-outline-danger btn-login text-uppercase mt-2 "
                    type="reset"
                  >
                    Reset
                  </button>
                </div>
                <div className="mt-4">
                  Don't have an admin account?{" "}
                  <Link to="/admin/register">Sign Up</Link>{" "}
                  {/* <-- CHANGE 9: Updated link */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
