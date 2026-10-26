import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getTokenRole } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://192.168.1.64:3000/auth/login", {
        email: state.email,
        password: state.password,
      });

      const token = res.data.token;
      if (!token) {
        alert(
          res.data.message || "Login failed: the server did not return a token.",
        );
        return;
      }

      const role = getTokenRole(token);
      if (!role) {
        alert("Login failed: the server returned an invalid or expired token.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.removeItem("role");

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="mt-16 flex min-h-[calc(100svh-4rem)] flex-col bg-white lg:flex-row">
      <div
        className="relative flex min-h-55 w-full items-end overflow-hidden px-6 py-8 sm:min-h-65 sm:px-10 lg:min-h-[calc(100svh-4rem)] lg:w-1/2 lg:px-14 lg:py-14"
      >
        <img
          src="/images/firstpage.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/60"></div>
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/15 to-transparent"></div>
        <div className="relative z-10 max-w-lg text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            VisitorHub | Your next visit
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Good to have you back.
          </h1>
          <p className="mt-3 hidden max-w-md text-sm leading-6 text-white/85 sm:block lg:text-base">
            Sign in to manage your details and pick up where you left off.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white px-4 py-8 sm:px-8 lg:w-1/2 lg:px-12 lg:py-10 xl:px-16">
        <div className="my-auto w-full max-w-md py-2">
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Welcome back
            </p>
            <h2 className="text-3xl font-bold text-slate-950">
              Sign in to your account
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Login to your VisitorHub account
            </p>
          </div>

          <form onSubmit={login} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={state.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={state.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/verifyemail"
                className="font-semibold text-blue-600 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
