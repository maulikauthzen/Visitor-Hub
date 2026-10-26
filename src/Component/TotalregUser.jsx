import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
  Ticket,
  Users,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = "http://192.168.1.64:3000";
const PAGE_SIZE = 10;

function authConfig() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
}

function formatCurrency(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Unable to load registrations. Please try again."
  );
}

export default function TotalregUser() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Number(searchParams.get("page")) || 1;

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_URL}/events/registrations`,
        authConfig(),
      );
      if (!Array.isArray(response.data)) {
        throw new Error(
          "The registrations response was not in the expected format.",
        );
      }
      setRegistrations(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return registrations;
    return registrations.filter((registration) =>
      [
        registration.attendeeName,
        registration.email,
        registration.event?.name,
        registration.pass?.name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [registrations, search]);

  const totalPages = Math.ceil(filteredRegistrations.length / PAGE_SIZE);
  const currentPage =
    totalPages === 0 ? 1 : Math.min(Math.max(requestedPage, 1), totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleRegistrations = filteredRegistrations.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, index) => {
      const firstPage = Math.min(
        Math.max(currentPage - 2, 1),
        Math.max(totalPages - 4, 1),
      );
      return firstPage + index;
    },
  );
  const totalRevenue = registrations.reduce(
    (sum, registration) => sum + (Number(registration.amount) || 0),
    0,
  );

  useEffect(() => {
    if (requestedPage !== currentPage) {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (currentPage === 1) next.delete("page");
          else next.set("page", String(currentPage));
          return next;
        },
        { replace: true },
      );
    }
  }, [currentPage, requestedPage, setSearchParams]);

  function setPage(page) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (page === 1) next.delete("page");
        else next.set("page", String(page));
        return next;
      },
      { preventScrollReset: true },
    );
  }

  function handleSearch(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  const registrationLink = (registration) =>
    `/reguser/${registration._id || registration.id}`;
  const startCount = filteredRegistrations.length === 0 ? 0 : startIndex + 1;
  const endCount = Math.min(
    startIndex + PAGE_SIZE,
    filteredRegistrations.length,
  );

  async function deleteregs(registrationId) {
    if (!registrationId) {
      setError("This registration cannot be deleted because its ID is missing.");
      return;
    }
    if (!window.confirm("Move this registration to the deleted archive?")) {
      return;
    }

    setDeletingId(registrationId);
    setError("");
    try {
      await axios.delete(
        `${API_URL}/events/registrations/${registrationId}`,
        authConfig(),
      );
      await loadRegistrations();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeletingId("");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] px-4 pb-10 pt-6 text-slate-900 sm:px-6 sm:pt-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin"
          className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-slate-500 transition hover:text-indigo-700"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <header className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
              <Users size={15} />
              Guest management
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Registrations
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              View and find attendees across all of your events.
            </p>
          </div>
          <label className="relative block w-full md:max-w-sm">
            <Search
              aria-hidden="true"
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              aria-label="Search registrations"
              value={search}
              onChange={handleSearch}
              placeholder="Search name, email, event, or pass..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </label>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <article className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total registrations
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                {registrations.length}
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Users size={20} />
            </span>
          </article>
          <article className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Registration revenue
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <span className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Ticket size={20} />
            </span>
          </article>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={loadRegistrations}
              className="min-h-10 shrink-0 rounded-lg border border-rose-200 bg-white px-4 font-semibold text-rose-700 hover:bg-rose-100"
            >
              Try again
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">All attendees</h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {startCount}–{endCount} of{" "}
                {filteredRegistrations.length}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
              <CalendarDays size={15} className="text-indigo-500" />
              {loading
                ? "Loading registrations..."
                : `${registrations.length} total`}
            </span>
          </div>

          {loading ? (
            <div className="px-5 py-16 text-center text-sm text-slate-500">
              <span className="mx-auto mb-3 block size-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
              Loading registrations...
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <Users size={22} />
              </span>
              <p className="font-semibold text-slate-800">
                {registrations.length
                  ? "No matching registrations"
                  : "No registrations yet"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {registrations.length
                  ? "Try changing your search."
                  : "Attendee registrations will appear here."}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100 lg:hidden">
                {visibleRegistrations.map((registration, index) => (
                  <article
                    key={
                      registration._id ||
                      registration.id ||
                      `${registration.email}-${startIndex + index}`
                    }
                    className="p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {registration.attendeeName || "Guest"}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {registration.email || "No email provided"}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Registered
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs">
                      <div className="min-w-0">
                        <p className="text-slate-400">Event</p>
                        <p className="mt-1 truncate font-medium text-slate-700">
                          {registration.event?.name || "Event"}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-400">Pass</p>
                        <p className="mt-1 truncate font-medium text-slate-700">
                          {registration.pass?.name || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Quantity</p>
                        <p className="mt-1 font-medium text-slate-700">
                          {registration.quantity ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Amount</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {formatCurrency(registration.amount)}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={registrationLink(registration)}
                      className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                    >
                      View registration
                      <ArrowRight size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        deleteregs(registration._id || registration.id)
                      }
                      disabled={Boolean(deletingId)}
                      className="mt-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-rose-200 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                    >
                      <Trash2 size={15} />
                      {deletingId === (registration._id || registration.id)
                        ? "Moving..."
                        : "Delete registration"}
                    </button>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-190 text-left text-sm">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                    <tr>
                      <th scope="col" className="px-6 py-3.5 font-bold">
                        Attendee
                      </th>
                      <th scope="col" className="px-4 py-3.5 font-bold">
                        Event
                      </th>
                      <th scope="col" className="px-4 py-3.5 font-bold">
                        Pass
                      </th>
                      <th scope="col" className="px-4 py-3.5 font-bold">
                        Qty.
                      </th>
                      <th scope="col" className="px-4 py-3.5 font-bold">
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-right font-bold"
                      >
                        Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-right font-bold"
                      >
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleRegistrations.map((registration, index) => (
                      <tr
                        key={
                          registration._id ||
                          registration.id ||
                          `${registration.email}-${startIndex + index}`
                        }
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="max-w-64 px-6 py-4">
                          <p className="truncate font-semibold text-slate-900">
                            {registration.attendeeName || "Guest"}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {registration.email || "No email provided"}
                          </p>
                        </td>
                        <td className="max-w-52 px-4 py-4 text-slate-700">
                          <span className="block truncate">
                            {registration.event?.name || "Event"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {registration.pass?.name || "—"}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {registration.quantity ?? "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">
                          {formatCurrency(registration.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={registrationLink(registration)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                          >
                            View <ArrowRight size={14} />
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              deleteregs(registration._id || registration.id)
                            }
                            disabled={Boolean(deletingId)}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!loading && totalPages > 1 && (
            <nav
              aria-label="Registration pages"
              className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <p className="text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center justify-between gap-1 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                {pageNumbers.map((page) => (
                  <button
                    type="button"
                    key={page}
                    aria-current={page === currentPage ? "page" : undefined}
                    onClick={() => setPage(page)}
                    className={`grid size-10 place-items-center rounded-lg text-sm font-semibold ${
                      page === currentPage
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
