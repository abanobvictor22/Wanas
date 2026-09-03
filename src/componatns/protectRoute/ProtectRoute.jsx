import React, { useContext } from "react";
import Login from "../../page/login/Login";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (token) {
    return children;
  }

  return <Navigate to="login" />;
}
