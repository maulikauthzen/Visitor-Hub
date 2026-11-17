import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../lib/api";

export default function Forgetpassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function forgotpassw(e) {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });

      const otp = res.data.otp;
      if (res.data.success !== true && !otp) {
        alert(res.data.message || "No account was found with that email.");
        return;
      }

      alert(res.data.message || "Password reset code sent successfully!");
      navigate("/resetpassw", {
        state: { email, otp: otp ? String(otp) : "" },
      });
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-svh flex-col bg-white lg:flex-row">
      <section className="relative flex min-h-55 w-full items-end overflow-hidden px-6 py-8 sm:min-h-65 sm:px-10 lg:min-h-svh lg:w-1/2 lg:px-14 lg:py-14">
        <img
          src="/images/forgotpa.jpg"
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
            Let’s get you back in.
          </h1>
          <p className="mt-3 hidden max-w-md text-sm leading-6 text-white/85 sm:block lg:text-base">
            Enter the email linked to your account and we’ll send you a code to
            reset your password.
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
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              No worries. We’ll send a one-time code to your email.
            </p>
          </div>

          <form onSubmit={forgotpassw} className="space-y-5">
            <div>
              <label
                htmlFor="forgot-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Send reset code"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Back to login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
