import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    city: "",
    gender: "",
    company: "",
    // email: "",
    // phone: "",
  });

  useEffect(() => {
    const checkRegisterToken = async () => {
      const token = localStorage.getItem("registerToken");

      console.log("REGISTER TOKEN:", token);

      if (!token) {
        navigate("/verifyemail", { replace: true });
        return;
      }

      try {
        await axios.get("http://192.168.1.64:3000/auth/register", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Register token is valid");
      } catch (error) {
        console.log("REGISTER TOKEN ERROR:", error);

        localStorage.removeItem("registerToken");

        navigate("/verifyemail", { replace: true });
      }
    };

    checkRegisterToken();
  }, [navigate]);

  const signup = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("registerToken");

    console.log("TOKEN FOR REGISTER:", token);

    if (!token) {
      alert("Register token is required");
      navigate("/verifyemail");
      return;
    }

    try {
      const res = await axios.post(
        "http://192.168.1.64:3000/auth/register",
        state,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("REGISTER RESPONSE:", res.data);

      alert(res.data.message || "Signup successful");

      localStorage.removeItem("registerToken");

      navigate("/login");
    } catch (error) {
      console.log("REGISTER ERROR:", error);
      console.log("BACKEND RESPONSE:", error.response?.data);

      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8 mt-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-gray-500 text-sm sm:text-base">
            Register your account to continue
          </p>
        </div>

        <form onSubmit={signup} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>

              <input
                type="text"
                value={state.firstName}
                placeholder="Enter First Name"
                onChange={(e) => {
                  const value = e.target.value;

                  setState({
                    ...state,
                    firstName: value.charAt(0).toUpperCase() + value.slice(1),
                  });
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>

              <input
                type="text"
                value={state.lastName}
                placeholder="Enter Last Name"
                onChange={(e) => {
                  const value = e.target.value;
                  setState({
                    ...state,
                    lastName: value.charAt(0).toUpperCase() + value.slice(1),
                  });
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>

            <select
              value={state.gender}
              onChange={(e) => setState({ ...state, gender: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>

            <input
              type="text"
              value={state.company}
              placeholder="Enter Company Name"
              onChange={(e) => setState({ ...state, company: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>

            <input
              type="text"
              value={state.city}
              placeholder="Enter City"
              onChange={(e) => setState({ ...state, city: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          If you already have an account{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
