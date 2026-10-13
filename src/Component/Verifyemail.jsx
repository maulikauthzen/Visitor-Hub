import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Verifyemail() {
  const [state, setState] = useState({
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  async function sendOtp() {
    try {
      const res = await axios.post("http://192.168.1.64:3000/auth/send-otp", {
        email: state.email,
        phone: state.phone,
      });

      alert(`OTP sent successfully . OTP - ${res.data.otp}`);

    } catch (error) {
      console.log("SEND OTP ERROR:", error);
      console.log("BACKEND RESPONSE:", error.response?.data);

      alert(error.response?.data?.message || "Failed to send OTP");
    }
  }

  async function verifyemail(e) {
    e.preventDefault();

    if (state.password !== state.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://192.168.1.64:3000/auth/verify-otp", {
        email: state.email,
        phone: state.phone,
        otp: state.otp,
        password: state.password,
        confirmPassword: state.confirmPassword,
      });

      console.log("OTP RESPONSE:", res);

      if (res.data.registerToken) {
        localStorage.setItem("registerToken", res.data.registerToken);

        alert(res.data.message || "OTP verified successfully");

        navigate("/register");
      } else {
        alert(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.log("VERIFY OTP ERROR:", error);
      console.log("BACKEND RESPONSE:", error.response?.data);

      alert(error.response?.data?.message || "OTP verification failed");
    }
  }

  return (
    <div className="mt-16 flex min-h-[calc(100svh-4rem)] flex-col bg-white lg:flex-row">
      {/* Left Section */}
      <div
        className="relative flex min-h-55 w-full items-end overflow-hidden bg-cover bg-center bg-no-repeat px-6 py-8 sm:min-h-65 sm:px-10 lg:min-h-[calc(100svh-4rem)] lg:w-1/2 lg:px-14 lg:py-14"
        style={{
          backgroundImage: "url('/images/Verify.webp')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/35"></div>
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/15 to-transparent"></div>
        <div className="relative z-10 max-w-lg text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            VisitorHub | Account setup
          </p>
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            A few quick steps, then you're ready to visit.
          </h2>
          <p className="mt-3 hidden max-w-md text-sm leading-6 text-white/85 sm:block lg:text-base">
            Verify your contact details to create a secure account.
          </p>
        </div>
      </div>
      {/* Right Section */}
      <div className="flex w-full items-center justify-center bg-white px-4 py-8 sm:px-8 lg:w-1/2 lg:overflow-y-auto lg:px-12 lg:py-10 xl:px-16">
        <div className="my-auto w-full max-w-xl py-2">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
              Verify Your Account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Enter your email, phone number and OTP
            </p>
          </div>

          {/* Form */}
          <form onSubmit={verifyemail} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={state.email}
                  onChange={(e) =>
                    setState({
                      ...state,
                      email: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={state.phone}
                  onChange={(e) =>
                    setState({
                      ...state,
                      phone: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Send OTP */}
            <button
              type="button"
              onClick={sendOtp}
              className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white transition duration-200 hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Send OTP
            </button>

            {/* OTP */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                OTP
              </label>

              <input
                type="text"
                inputMode="text"
                maxLength={8}
                placeholder="Enter OTP"
                value={state.otp}
                onChange={(e) =>
                  setState({
                    ...state,
                    otp: e.target.value,
                  })
                }
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-xl tracking-[0.3em] text-slate-900 outline-none transition placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Enter Password
                </label>

                <input
                  type="password"
                  placeholder="Enter password"
                  value={state.password}
                  onChange={(e) =>
                    setState({
                      ...state,
                      password: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Enter confirm password"
                  value={state.confirmPassword}
                  onChange={(e) =>
                    setState({
                      ...state,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Verify Account
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already verified?{" "}
            <span
              onClick={() => {
                localStorage.removeItem("registerToken");
                navigate("/login");
              }}
              className="cursor-pointer font-medium text-blue-700 hover:text-blue-800"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
