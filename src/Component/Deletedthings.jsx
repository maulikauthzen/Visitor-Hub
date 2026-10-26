import React from "react";
import { Archive, ArrowLeft, CalendarDays, Ticket, Users } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

const sections = [
  { label: "Events", path: "events", icon: CalendarDays },
  { label: "Passes", path: "passes", icon: Ticket },
  { label: "Registrations", path: "registrations", icon: Users },
];

export default function Deletedthings() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <Link
              to="/admin"
              className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-slate-500 transition hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to dashboard
            </Link>
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
                <Archive size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                  Admin workspace
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Deleted items
                </h1>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Review archived events, passes, and registrations in one place.
            </p>
          </div>
        </div>

        <div className="grid items-start gap-4 md:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
          <nav
            aria-label="Deleted item categories"
            className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm md:sticky md:top-6 md:flex-col md:overflow-visible md:p-3"
          >
            <p className="hidden px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400 md:block">
              Archive
            </p>
            {sections.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  `inline-flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 md:w-full ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <main className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-7">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
