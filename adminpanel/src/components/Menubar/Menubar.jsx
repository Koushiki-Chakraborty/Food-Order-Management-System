import React from "react";
import { useNavigate } from "react-router-dom";

const Menubar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    navigate("/admin/login");
    window.location.reload();
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

        <div className="ms-auto">
          {" "}
          {/* ms-auto pushes the item to the right */}
          <button className="btn btn-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> {/* Added an icon */}
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
