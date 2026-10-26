import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  Ticket,
  CalendarDays,
  IndianRupee,
  Users,
  RefreshCw,
  Trash2,
  Archive,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

const API_URL = "http://192.168.1.64:3000";

export default function Deletedevents() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingId, setWorkingId] = useState("");
  const [workingAction, setWorkingAction] = useState("");

  const getdata = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API_URL}/events/passes/deleted`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load deleted passes. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getdata();
  }, [getdata]);

  async function permanentlyDeletePass(eventId, passId) {
    if (!eventId || !passId) {
      setError("This pass cannot be deleted because its ID is missing.");
      return;
    }
    if (
      !window.confirm(
        "Permanently delete this pass? This action cannot be undone.",
      )
    ) {
      return;
    }

    const actionId = `${eventId}:${passId}`;
    setWorkingId(actionId);
    setWorkingAction("delete");
    setError("");
    try {
      await axios.delete(
        `${API_URL}/events/${eventId}/passes/${passId}/permanent`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      await getdata();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to permanently delete this pass. Please try again.",
      );
    } finally {
      setWorkingId("");
      setWorkingAction("");
    }
  }

  async function restorePass(eventId, passId) {
    if (!eventId || !passId) {
      setError("This pass cannot be restored because its ID is missing.");
      return;
    }

    const actionId = `${eventId}:${passId}`;
    setWorkingId(actionId);
    setWorkingAction("restore");
    setError("");
    try {
      await axios.patch(
        `${API_URL}/events/${eventId}/passes/${passId}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      await getdata();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to restore this pass. Please try again.",
      );
    } finally {
      setWorkingId("");
      setWorkingAction("");
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
              Pass management
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Deleted passes
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-5 text-slate-500">
              Review passes that have been removed from your events.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {!loading && !error && (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {data.length} {data.length === 1 ? "pass" : "passes"}
            </span>
          )}
          <button
            type="button"
            onClick={getdata}
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
                Couldn’t load or update deleted passes
              </p>
              <p className="mt-1  text-sm text-rose-800">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={getdata}
            disabled={loading}
            className="min-h-10 rounded-lg bg-rose-700 px-4 text-sm font-semibold text-white transition hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div
          role="status"
          aria-label="Loading deleted passes"
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
              <div className="h-20 rounded-xl bg-slate-50" />
            </div>
          ))}
          <span className="sr-only">Loading deleted passes...</span>
        </div>
      ) : error && data.length === 0 ? null : data.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-12 text-center sm:py-16">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-emerald-800 shadow-sm">
            <Ticket size={21} aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-base font-bold text-slate-900">
            No deleted passes
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
            Deleted passes will appear here when they are available.
          </p>
          <button
            type="button"
            onClick={getdata}
            className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
          >
            <RefreshCw size={15} aria-hidden="true" />
            Check again
          </button>
        </div>
      ) : (
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((el, i) => {
            const eventId =
              typeof el.eventId === "object"
                ? el.eventId?._id || el.eventId?.id
                : el.eventId || el.eventid;
            const passId = el._id || el.id;
            const actionId = `${eventId || ""}:${passId || ""}`;
            const isWorking = workingId === actionId;

            return (
              <li
                key={passId || i}
                className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800 transition">
                      <Ticket size={20} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-sm font-bold leading-5 text-slate-950 sm:text-base">
                        {el.name || el.passname || "Untitled pass"}
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Pass #{i + 1}
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
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {el.eventName ||
                          el.eventname ||
                          el.eventId?.eventname ||
                          "Event not available"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-4">
                      <span className="mb-3 grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                        <IndianRupee size={16} aria-hidden="true" />
                      </span>
                      <p className="text-xs font-medium text-slate-500">
                        Pass price
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        ₹{el.price ?? el.passprice ?? "N/A"}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-4">
                      <span className="mb-3 grid size-8 place-items-center rounded-lg bg-sky-50 text-sky-700">
                        <Users size={16} aria-hidden="true" />
                      </span>
                      <p className="text-xs font-medium text-slate-500">
                        Sold slots
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {el.soldSlots ?? "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 border-t border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 sm:p-5">
                  <button
                    type="button"
                    onClick={() => restorePass(eventId, passId)}
                    disabled={loading || Boolean(workingId)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                    {isWorking && workingAction === "restore"
                      ? "Restoring..."
                      : "Restore pass"}
                  </button>
                  <button
                    type="button"
                    onClick={() => permanentlyDeletePass(eventId, passId)}
                    disabled={loading || Boolean(workingId)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    {isWorking && workingAction === "delete"
                      ? "Deleting..."
                      : "Delete permanently"}
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
