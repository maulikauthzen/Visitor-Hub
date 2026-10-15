
import React from "react";
import {
  ShieldCheck,
  Users,
  CalendarDays,
  Ticket,
  Target,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Aboutus() {
  const features = [
    {
      icon: <Users size={28} />,
      title: "Easy Visitor Management",
      description:
        "Manage visitor information and registrations through a simple and organized platform.",
    },
    {
      icon: <CalendarDays size={28} />,
      title: "Event Management",
      description:
        "Discover events, explore event details, and make the registration process easier.",
    },
    {
      icon: <Ticket size={28} />,
      title: "Digital Passes",
      description:
        "View available passes and manage your event registrations in one place.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Secure Experience",
      description:
        "We aim to provide a reliable experience for managing visitor and event information.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f6ef] text-gray-800">
      {/* Hero Section */}
      <section className="bg-[#173d32] px-4 py-12 text-center text-white sm:px-6 sm:py-16 lg:py-20">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-green-300 sm:text-sm sm:tracking-[3px]">
          About Visitor Hub
        </p>

        <h1 className="mx-auto max-w-4xl text-balance text-[clamp(2rem,6vw,3.75rem)] font-bold leading-tight">
          Making Visitor Management Simple and Smart
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-200 sm:mt-6 sm:text-base sm:leading-7">
          Visitor Hub brings visitor registration, event management,
          and digital passes together in one convenient platform.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-center font-semibold text-[#173d32] transition hover:bg-green-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mt-8 sm:px-6"
        >
          Explore Our Platform <ArrowRight size={18} />
        </Link>
      </section>

      {/* About Section */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-14 md:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#285b49] sm:text-sm sm:tracking-widest">
            Who We Are
          </p>

          <h2 className="text-balance text-2xl font-bold sm:text-3xl lg:text-4xl">
            Welcome to Visitor Hub
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600 sm:mt-5 sm:text-base sm:leading-8">
            Visitor Hub is designed to simplify the way visitors
            register for events and manage their passes. Our platform
            helps users find event information, register conveniently,
            and keep track of their registrations.
          </p>

          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
            Our goal is to create a smooth and organized experience
            for visitors and administrators through easy-to-use
            digital tools.
          </p>
        </div>

        <div className="min-w-0 rounded-2xl bg-white p-5 shadow-lg sm:rounded-3xl sm:p-8 lg:p-12">
          <div className="mb-5 inline-flex rounded-xl bg-green-100 p-3 text-[#173d32] sm:mb-6 sm:rounded-2xl sm:p-4">
            <Target size={38} />
          </div>

          <h3 className="text-xl font-bold sm:text-2xl">Our Mission</h3>

          <p className="mt-3 text-sm leading-7 text-gray-600 sm:mt-4 sm:text-base">
            To make visitor registration and event access simpler,
            more convenient, and better organized with technology.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#285b49] sm:text-sm sm:tracking-widest">
              What We Offer
            </p>

            <h2 className="mt-3 text-balance text-2xl font-bold sm:text-3xl lg:text-4xl">
              Why Choose Visitor Hub?
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-600 sm:mt-4 sm:text-base">
              Everything you need for a more convenient visitor
              and event registration experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="min-w-0 rounded-2xl border border-gray-100 bg-[#f4f6ef] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 lg:hover:-translate-y-2"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[#173d32] p-3 text-white sm:mb-5">
                  {feature.icon}
                </div>

                <h3 className="text-base font-bold sm:text-lg">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-2xl bg-[#173d32] px-5 py-9 text-center text-white sm:rounded-3xl sm:px-8 sm:py-12 lg:px-12">
          <h2 className="text-balance text-2xl font-bold sm:text-3xl lg:text-4xl">
            Ready to Get Started?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-200 sm:text-base">
            Explore upcoming events and experience a simpler way
            to manage your registrations with Visitor Hub.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-center font-semibold text-[#173d32] transition hover:bg-green-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-6"
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
