import React, { useContext, useState, useRef, useEffect } from "react";
import "./Menubar.css";
import { assets } from "../../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";

const Menubar = () => {
  const [active, setActive] = useState("home");
  const { quantities, token, setToken, setQuantities, user } =
    useContext(StoreContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
    setQuantities({});
  };

  const uniqueItemInCart = Object.values(quantities || {}).filter(
    (qty) => qty > 0
  ).length;

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <Link to={"/"}>
          <img
            src={assets.logo}
            alt="Logo"
            className="mx-4"
            height={48}
            width={48}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={
                  active === "home" ? "nav-link fw-bold active" : "nav-link"
                }
                to="/"
                onClick={() => setActive("home")}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  active === "explore" ? "nav-link fw-bold active" : "nav-link"
                }
                to="/explore"
                onClick={() => setActive("explore")}
              >
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  active === "contact-us"
                    ? "nav-link fw-bold active"
                    : "nav-link"
                }
                to="/contact"
                onClick={() => setActive("contact-us")}
              >
                Contact us
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-4">
            <Link to={`/cart`}>
              <div className="position-relative">
                <img
                  src={assets.cart}
                  alt=""
                  height={32}
                  width={32}
                  className="position-relative"
                />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                  {uniqueItemInCart}
                </span>
              </div>
            </Link>
            {!token ? (
              <>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => navigate("/register")}
                >
                  Register
                </button>
              </>
            ) : (
              <div className="position-relative" ref={dropdownRef}>
                <button
                  className="btn border-0 bg-transparent p-0 d-flex align-items-center"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={assets.profile}
                    alt="profile"
                    width={32}
                    height={32}
                    className="rounded-circle"
                  />
                  <i
                    className={`bi bi-caret-${
                      dropdownOpen ? "up" : "down"
                    }-fill ms-1`}
                  ></i>
                </button>

                {dropdownOpen && (
                  <ul
                    className="dropdown-menu text-small show"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "40px",
                      display: "block",
                      zIndex: 1000,
                    }}
                  >
                    <li className="dropdown-item-text text-muted small text-truncate text-center px-2">
                      {user?.email}
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => navigate("/myorders")}
                    >
                      Orders
                    </li>
                    <li className="dropdown-item" onClick={logout}>
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menubar;
