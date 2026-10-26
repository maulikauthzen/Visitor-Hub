import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  Search,
  Trash2,
  Ticket,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://192.168.1.64:3000";

function getAuthConfig() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
}

export default function Registreduser() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_URL}/events/${id}/registrations`,
        getAuthConfig(),
      );
      if (!Array.isArray(response.data)) {
        throw new Error(
          "The registrations response was not in the expected format.",
        );
      }
      setRegistrations(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load attendees. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return registrations;
    return registrations.filter((user) =>
      [
        user.attendeeName,
        user.email,
        user.phone,
        user.mobile,
        user.pass?.name,
        user.passName,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [registrations, search]);

  const totalTickets = registrations.reduce(
    (total, user) => total + (Number(user.quantity) || 0),
    0,
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
        getAuthConfig(),
      );
      await loadRegistrations();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to delete this registration. Please try again.",
      );
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
              Registered attendees
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Review attendee details and ticket quantities for this event.
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
              aria-label="Search attendees"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, or pass..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </label>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <article className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Attendee registrations
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
                Tickets reserved
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                {totalTickets}
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
              <h2 className="font-bold text-slate-900">Attendee list</h2>
              <p className="mt-1 text-xs text-slate-500">
                {loading
                  ? "Loading attendees..."
                  : `${filteredUsers.length} matching attendees`}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
              <CheckCircle2 size={15} className="text-emerald-500" />
              Registration details
            </span>
          </div>

          {loading ? (
            <div className="px-5 py-16 text-center text-sm text-slate-500">
              <span className="mx-auto mb-3 block size-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
              Loading attendees...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <Users size={22} />
              </span>
              <p className="font-semibold text-slate-800">
                {registrations.length
                  ? "No matching attendees"
                  : "No registrations yet"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {registrations.length
                  ? "Try a different search."
                  : "Attendees will appear here after they register."}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredUsers.map((user, index) => (
                  <article
                    key={user._id || user.id || `${user.email}-${index}`}
                    className="p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {user.attendeeName || "Guest"}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {user.email || "No email provided"}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Registered
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs">
                      <div>
                        <p className="text-slate-400">Phone</p>
                        <p className="mt-1 break-all font-medium text-slate-700">
                          {user.phone || user.mobile || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Pass</p>
                        <p className="mt-1 truncate font-medium text-slate-700">
                          {user.pass?.name || user.passName || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Quantity</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {user.quantity ?? "—"}
                        </p>
                      </div>
                      <div className="flex items-end justify-end">
                        <span className="inline-flex items-center gap-1 text-indigo-600">
                          <Ticket size={14} />
                          Ticket holder
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        to={`/reguser/${user._id || user.id}`}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                      >
                        View details <ArrowRight size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteregs(user._id || user.id)}
                        disabled={Boolean(deletingId)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                      >
                        <Trash2 size={15} />
                        {deletingId === (user._id || user.id)
                          ? "Moving..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-212.5 text-left text-sm">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                    <tr>
                      <th scope="col" className="px-6 py-3.5 font-bold">
                        #
                      </th>
                      <th scope="col" className="px-4 py-3.5 font-bold">
                        Attendee
                      </th>
                      <th scope="col" className="px-4 py-3.5 font-bold">
                        Phone
                      </th>
                      <th scope="col" className="px-4 py-3.5 font-bold">
                        Pass
                      </th>
                      <th scope="col" className="px-4 py-3.5 font-bold">
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-right font-bold"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3.5 text-right font-bold"
                      >
                        view
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
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user._id || user.id || `${user.email}-${index}`}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-4 text-slate-400">
                          {index + 1}
                        </td>
                        <td className="max-w-72 px-4 py-4">
                          <p className="truncate font-semibold text-slate-900">
                            {user.attendeeName || "Guest"}
                          </p>
                          <p className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-slate-500">
                            <Mail size={12} className="shrink-0" />
                            <span className="truncate">
                              {user.email || "No email provided"}
                            </span>
                          </p>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {user.phone || user.mobile || "—"}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {user.pass?.name || user.passName || "—"}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Registered
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-800">
                          {user.quantity ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-800">
                          <Link
                            to={`/reguser/${user._id || user.id}`}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                          >
                            View <ArrowRight size={14} />
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <button
                            type="button"
                            onClick={() => deleteregs(user._id || user.id)}
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

          <footer className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:px-6">
            Showing {filteredUsers.length} of {registrations.length} attendee
            registrations
          </footer>
        </section>
      </div>
    </main>
  );
}
