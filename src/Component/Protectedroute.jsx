import React from "react";
import { Navigate } from "react-router-dom";

export default function Protectedroute({ children, allowedRole }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && !allowedRole.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}