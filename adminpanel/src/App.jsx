import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Orders from "./pages/Orders/Orders";
import AddFood from "./pages/AddFood/AddFood";
import ListFood from "./pages/ListFood/ListFood";
import Sidebar from "./components/Sidebar/Sidebar";
import Menubar from "./components/Menubar/Menubar";
import { ToastContainer } from "react-toastify";

import AdminLogin from "./components/Login/AdminLogin";
import AdminRegister from "./components/Register/AdminRegister";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("adminToken");

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const isAuthenticated = !!localStorage.getItem("adminToken");
  return (
    <div className="d-flex" id="wrapper">
      {isAuthenticated && <Sidebar sidebarVisible={sidebarVisible} />}
      <div id="page-content-wrapper" className={isAuthenticated ? "" : "w-100"}>
        {isAuthenticated && <Menubar toggleSidebar={toggleSidebar} />}
        <ToastContainer />
        <div className="container-fluid">
          <Routes>
            {/* -------------------- PUBLIC ADMIN ROUTES -------------------- */}
            <Route
              path="/admin/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <AdminLogin />
              }
            />
            <Route
              path="/admin/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <AdminRegister />
                )
              }
            />

            {/* -------------------- PROTECTED ADMIN ROUTES -------------------- */}

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <ListFood />
                </PrivateRoute>
              }
            />

            {/* -------------------- Food Management Routes -------------------- */}
            <Route
              path="/add"
              element={
                <PrivateRoute>
                  <AddFood />
                </PrivateRoute>
              }
            />
            <Route
              path="/list"
              element={
                <PrivateRoute>
                  <ListFood />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />

            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/" : "/admin/login"} replace />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
