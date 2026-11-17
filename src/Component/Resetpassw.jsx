import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/api";
import axios from "axios";

export default function Resetpassw() {
  const location = useLocation();
  const [state, setState] = useState({
    email: location.state?.email || "",
    otp: location.state?.otp || "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  function handleChange(e) {
    const { name, value } = e.target;

    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function resetpasswo(e) {
    e.preventDefault();

    if (
      !state.email ||
      !state.otp ||
      !state.password ||
      !state.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (state.password !== state.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/auth/reset-password`, {
        email: state.email,
        otp: state.otp,
        password: state.password,
        confirmPassword: state.confirmPassword,
      });

      if (res.data.success) {
        alert(res.data.message);
        setState({
          email: "",
          otp: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login")
      } else {
        alert(res.data.message || "Password reset failed");
      }
    } catch (error) {
      const message = error.response?.data?.message;

      alert(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Password reset failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-white lg:flex-row">
      <section className="relative flex min-h-55 w-full items-end overflow-hidden px-6 py-8 sm:min-h-65 sm:px-10 lg:min-h-svh lg:w-1/2 lg:px-14 lg:py-14">
        <img
          src="/images/resetpass.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
        <div className="relative z-10 max-w-lg text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            VisitorHub | Account security
          </p>
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            A fresh start, securely.
          </h1>
          <p className="mt-3 hidden max-w-md text-sm leading-6 text-white/85 sm:block lg:text-base">
            Verify your code and choose a new password to secure your account.
          </p>
        </div>
      </section>

      <section className="flex w-full items-center justify-center bg-white px-4 py-10 sm:px-8 lg:w-1/2 lg:px-12 lg:py-10 xl:px-16">
        <div className="my-auto w-full max-w-md py-2">
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Password recovery
            </p>
            <h2 className="text-3xl font-bold text-slate-950">
              Reset your password
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the code we sent you and set a new password.
            </p>
          </div>

          {location.state?.otp && (
            <p
              role="status"
              className="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"
            >
              Your verification code is{" "}
              <span className="font-bold tracking-wider">
                {location.state.otp}
              </span>
            </p>
          )}

          <form onSubmit={resetpasswo} className="space-y-4">
            <div>
              <label
                htmlFor="reset-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={state.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="reset-otp"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Verification code
              </label>
              <input
                id="reset-otp"
                type="text"
                name="otp"
                autoComplete="one-time-code"
                inputMode="numeric"
                placeholder="Enter the code from your email"
                // value={state.otp}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Enter a new password"
                value={state.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm your new password"
                value={state.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Need to start over?{" "}
            <Link
              to="/forgetpass"
              className="font-semibold text-blue-600 hover:underline"
            >
              Request a new code
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
