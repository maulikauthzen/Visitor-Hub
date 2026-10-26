import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Archive,
  CalendarDays,
  IndianRupee,
  RefreshCw,
  RotateCcw,
  Search,
  Ticket,
  Trash2,
  Users,
} from "lucide-react";

const API_URL = "http://192.168.1.64:3000";

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

export default function Deletedregs() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState("");

  const loadRegistrations = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Your session has expired. Please log in again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_URL}/events/registrations/deleted`,
        authConfig(),
      );
      if (!Array.isArray(response.data)) {
        throw new Error(
          "The deleted registrations response was not in the expected format.",
        );
      }
      setRegistrations(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load deleted registrations. Please try again.",
      );
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
        registration.eventName,
        registration.event?.name,
        registration.passName,
        registration.pass?.name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [registrations, search]);

  async function restoreRegistration(registrationId) {
    if (!registrationId) {
      setError("This registration cannot be restored because its ID is missing.");
      return;
    }

    setWorkingId(registrationId);
    setError("");
    try {
      await axios.patch(
        `${API_URL}/events/registrations/${registrationId}/restore`,
        {},
        authConfig(),
      );
      await loadRegistrations();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to restore this registration. Please try again.",
      );
    } finally {
      setWorkingId("");
    }
  }

  async function permanentlyDeleteRegistration(registrationId) {
    if (!registrationId) {
      setError("This registration cannot be deleted because its ID is missing.");
      return;
    }
    if (
      !window.confirm(
        "Permanently delete this registration? This action cannot be undone.",
      )
    ) {
      return;
    }

    setWorkingId(registrationId);
    setError("");
    try {
      await axios.delete(
        `${API_URL}/events/registrations/${registrationId}/permanent`,
        authConfig(),
      );
      await loadRegistrations();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to permanently delete this registration. Please try again.",
      );
    } finally {
      setWorkingId("");
    }
  }

  return (
    <section className="w-full min-w-0 space-y-6 text-slate-900">
      <header className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
            <Archive size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
              Guest management
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Deleted registrations
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
              Restore a registration or permanently remove it from the archive.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {!loading && !error && (
            <span className="self-start rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:self-auto">
              {registrations.length}{" "}
              {registrations.length === 1 ? "registration" : "registrations"}
            </span>
          )}
          <button
            type="button"
            onClick={loadRegistrations}
            disabled={loading}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
              aria-hidden="true"
            />
            Refresh
          </button>
        </div>
      </header>

      <label className="relative block w-full sm:max-w-md">
        <Search
          aria-hidden="true"
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          aria-label="Search deleted registrations"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search attendee, event, or pass..."
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
        />
      </label>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex min-w-0 items-start gap-3">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-rose-600"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="font-semibold text-rose-900">
                Couldn’t load or update deleted registrations
              </p>
              <p className="mt-1  text-sm text-rose-800">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadRegistrations}
            disabled={loading}
            className="min-h-10 shrink-0 rounded-lg bg-rose-700 px-4 text-sm font-semibold text-white transition hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div
          role="status"
          aria-label="Loading deleted registrations"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-5 h-11 w-11 rounded-xl bg-slate-100" />
              <div className="mb-3 h-4 w-2/3 rounded bg-slate-100" />
              <div className="mb-5 h-3 w-1/2 rounded bg-slate-100" />
              <div className="h-24 rounded-xl bg-slate-50" />
            </div>
          ))}
          <span className="sr-only">Loading deleted registrations...</span>
        </div>
      ) : error ? null : filteredRegistrations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-12 text-center sm:py-16">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-emerald-800 shadow-sm">
            <Users size={21} aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-base font-bold text-slate-900">
            {registrations.length
              ? "No matching registrations"
              : "No deleted registrations"}
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
            {registrations.length
              ? "Try another name, event, or pass."
              : "Deleted registrations will appear here when available."}
          </p>
        </div>
      ) : (
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {filteredRegistrations.map((registration, index) => {
            const registrationId = registration._id || registration.id;
            const isWorking = workingId === registrationId;
            const eventName =
              registration.eventName ||
              registration.event?.name ||
              "Event not available";
            const passName =
              registration.passName || registration.pass?.name || "—";

            return (
              <li
                key={registrationId || `${registration.email}-${index}`}
                className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800">
                      <Ticket size={20} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold leading-5 text-slate-950 sm:text-base">
                        {registration.attendeeName || "Guest"}
                      </h2>
                      <p className="mt-1 break-all text-xs text-slate-500">
                        {registration.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
                    <Trash2 size={12} aria-hidden="true" />
                    Deleted
                  </span>
                </div>

                <div className="space-y-4 p-4 sm:p-5">
                  <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <CalendarDays
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-800"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Event
                      </p>
                      <p className="mt-1  text-sm font-semibold text-slate-800">
                        {eventName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-4">
                      <span className="mb-3 grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                        <Ticket size={16} aria-hidden="true" />
                      </span>
                      <p className="text-xs font-medium text-slate-500">Pass</p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-900">
                        {passName}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-4">
                      <span className="mb-3 grid size-8 place-items-center rounded-lg bg-sky-50 text-sky-700">
                        <IndianRupee size={16} aria-hidden="true" />
                      </span>
                      <p className="text-xs font-medium text-slate-500">
                        Amount
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-900">
                        {formatCurrency(registration.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 text-sm">
                    <span className="text-slate-500">Tickets</span>
                    <span className="font-semibold text-slate-900">
                      {registration.quantity ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 sm:p-5">
                  <button
                    type="button"
                    onClick={() => restoreRegistration(registrationId)}
                    disabled={Boolean(workingId)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                  >
                    <RotateCcw size={15} aria-hidden="true" />
                    {isWorking ? "Updating..." : "Restore"}
                  </button>
                  <button
                    type="button"
                    onClick={() => permanentlyDeleteRegistration(registrationId)}
                    disabled={Boolean(workingId)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Delete permanently
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
