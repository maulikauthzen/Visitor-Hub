import React from "react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        403
      </h1>

      <p className="text-xl mb-6">
        You are not authorized to access this page.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-5 py-2 bg-blue-600 text-white rounded"
      >
        Go Home
      </button>
    </div>
  );
}