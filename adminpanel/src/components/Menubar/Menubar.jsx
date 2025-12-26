import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../services/authService";

const Menubar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem("adminEmail");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logoutAdmin();
      navigate("/admin/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <button
          className="btn btn-primary"
          id="sidebarToggle"
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>

        <div className="ms-auto d-flex align-items-center">
          {/* Displaying the Admin Email next to the logout button */}
          <span className="me-3 text-muted d-none d-md-inline">
            <i className="bi bi-person-circle me-1"></i> {adminEmail}
          </span>
          <button className="btn btn-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
