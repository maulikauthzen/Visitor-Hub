import React from "react";
import { Link } from "react-router-dom";

export default function Firstpage() {
  return (
    <div
      className="relative flex min-h-[calc(100svh-4rem)] w-full items-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/frontpage.png')",
      }}
    >
      {/* <div className="absolute inset-0 bg-slate-950/55"></div> */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-950/70 via-slate-950/25 to-transparent"></div>

      <div className="relative z-10 max-w-3xl px-6 py-20 text-white sm:px-10 md:px-16">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
          VisitorHub | Welcome made simple
        </p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          Every visit starts with a warm welcome.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
          Plan your visit, complete registration, and arrive ready to enjoy the
          experience.
        </p>
      </div>
    </div>
  );
}
