import React from "react";
import { Navigate } from "react-router-dom";
import { getTokenRole } from "../lib/auth";

export default function Protectedroute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = getTokenRole(token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && !allowedRole.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}