import React, { createContext, useState, useEffect } from "react";

export const AdminContext = createContext(null);

const AdminContextProvider = (props) => {
  const [token, setToken] = useState(null);

  // On load, check if an admin token is in localStorage
  useEffect(() => {
    if (localStorage.getItem("adminToken")) {
      setToken(localStorage.getItem("adminToken"));
    }
  }, []);

  const contextValue = {
    token,
    setToken,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
