import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDownUp,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  LayoutDashboard,
  MapPin,
  Menu,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Ticket,
  Trash2,
  Users,
  X,
} from "lucide-react";

const API_URL = "http://192.168.1.64:3000";

const EMPTY_EVENT = {
  name: "",
  location: "",
  description: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

function getAuthConfig() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

function toLocalDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function toLocalTimeInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(11, 16);
}

function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function Adminpnanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({});
  const [form, setForm] = useState(EMPTY_EVENT);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventsLoading, setEventsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [lastLoadedAt, setLastLoadedAt] = useState(null);
  const today = toLocalDateInput(new Date());

  const loadEvents = useCallback(async (showLoading = true) => {
    if (showLoading) setEventsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/events`);
      const nextEvents = Array.isArray(response.data) ? response.data : [];
      setEvents(nextEvents);
      setLastLoadedAt(new Date());
      return true;
    } catch (error) {
      setPageError(getErrorMessage(error, "Unable to load events."));
      return false;
    } finally {
      if (showLoading) setEventsLoading(false);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/events/dashboard/summary`,
        getAuthConfig(),
      );
      setSummary(response.data || {});
      return true;
    } catch (error) {
      setPageError(
        (current) =>
          current ||
          getErrorMessage(error, "Unable to load dashboard metrics."),
      );
      return false;
    }
  }, []);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    setPageError("");
    const results = await Promise.all([loadEvents(), loadSummary()]);
    setRefreshing(false);
    return results.every(Boolean);
  }, [loadEvents, loadSummary]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  function resetForm() {
    setForm(EMPTY_EVENT);
    setEditingId(null);
    setFormError("");
  }

  function openCreateForm() {
    resetForm();
    setFormOpen(true);
    setActiveNav("events");
    requestAnimationFrame(() => {
      document.getElementById("event-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function openEditForm(event) {
    setForm({
      name: event.name || "",
      location: event.location || "",
      description: event.description || "",
      startDate: toLocalDateInput(event.startDate),
      endDate: toLocalDateInput(event.endDate),
      startTime: toLocalTimeInput(event.startDate),
      endTime: toLocalTimeInput(event.endDate),
    });
    setEditingId(event.id);
    setFormError("");
    setFormOpen(true);
    setActiveNav("events");
    requestAnimationFrame(() => {
      document.getElementById("event-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function closeForm() {
    setFormOpen(false);
    resetForm();
  }

  async function submitEvent(event) {
    event.preventDefault();
    setFormError("");

    const startsAt = new Date(`${form.startDate}T${form.startTime}:00`);
    const endsAt = new Date(`${form.endDate}T${form.endTime}:00`);
    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime()) ||
      endsAt <= startsAt
    ) {
      setFormError("The event end must be later than its start.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      startDate: startsAt.toISOString(),
      endDate: endsAt.toISOString(),
    };

    setSaving(true);
    try {
      if (editingId) {
        await axios.patch(
          `${API_URL}/events/${editingId}`,
          payload,
          getAuthConfig(),
        );
      } else {
        await axios.post(`${API_URL}/events`, payload, getAuthConfig());
      }
      closeForm();
      await Promise.all([loadEvents(false), loadSummary()]);
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          editingId
            ? "Unable to update this event."
            : "Unable to create this event.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm("Delete this event? This action cannot be undone."))
      return;

    setDeletingId(id);
    setPageError("");
    try {
      await axios.delete(`${API_URL}/events/${id}`, getAuthConfig());
      setEvents((current) => current.filter((event) => event.id !== id));
      await loadSummary();
    } catch (error) {
      setPageError(getErrorMessage(error, "Unable to delete this event."));
    } finally {
      setDeletingId(null);
    }
  }

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) => {
      const searchable = [event.name, event.location, event.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? Boolean(event.isActive) : !event.isActive);
      return searchable && matchesStatus;
    });
  }, [events, search, statusFilter]);

  const stats = [
    {
      label: "Total events",
      value: summary.totalEvents ?? events.length,
      note: "Across your workspace",
      icon: CalendarDays,
      tone: "indigo",
    },
    {
      label: "Active events",
      value:summary.activeEvents ?? events.filter((item) => item.isActive).length,
      note: "Currently published",
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      label: "Registrations",
      value: summary.totalRegistrations ?? 0,
      note: "Guest sign-ups",
      icon: Users,
      tone: "amber",
    },
    {
      label: "Total revenue",
      value: `₹${summary.totalRevenue ?? 0}`,
      note: "Across all events",
      icon: BarChart3,
      tone: "rose",
    },
  ];

  const iconTones = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-slate-900">
      {mobileNavOpen && (
        <button
          aria-label="Close navigation"
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-65 flex-col border-r border-slate-200 bg-white px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setMobileNavOpen(false)}
          className="absolute right-4 top-6 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <X size={18} />
        </button>
        <Link
          to="/admin"
          onClick={() => setMobileNavOpen(false)}
          className="flex items-center gap-3 px-2"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Sparkles size={20} />
          </span>
          <span>
            <span className="block text-sm font-bold tracking-tight text-slate-950">
              VisitorHub
            </span>
            <span className="block text-xs text-slate-500">
              Admin workspace
            </span>
          </span>
        </Link>

        <div className="mt-10">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <nav className="space-y-1" aria-label="Admin navigation">
            <a
              href="#overview"
              onClick={() => {
                setActiveNav("overview");
                setMobileNavOpen(false);
              }}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                activeNav === "overview"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <LayoutDashboard size={18} />
              Overview
            </a>

            <a
              href="#events"
              onClick={() => {
                setActiveNav("events");
                setMobileNavOpen(false);
              }}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                activeNav === "events"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <CalendarDays size={18} />
              Events
              <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {events.length}
              </span>
            </a>

            <Link
              to="/allreguser"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <Users size={18} />
              Registrations
              <ArrowRight className="ml-auto" size={15} />
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileNavOpen(false);
                navigate("/scanqr");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <Ticket size={18} />
              Scan tickets
              <ArrowRight className="ml-auto" size={15} />
            </button>
            <Link
              to="/deletedthings/events"
              onClick={() => setMobileNavOpen(false)}
              aria-current={
                location.pathname.startsWith("/deletedthings") ? "page" : undefined
              }
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                location.pathname.startsWith("/deletedthings")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <Trash2 size={18} />
              Deleted items
              <ArrowRight className="ml-auto" size={15} />
            </Link>
          </nav>
        </div>

        <div className="mt-8">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Account
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <Settings size={18} />
            Back to website
            <ArrowRight className="ml-auto" size={15} />
          </button>
        </div>
      </aside>

      <div className="min-h-screen min-w-0 lg:pl-65">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-7 lg:px-9">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open admin navigation"
                onClick={() => setMobileNavOpen(true)}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
              >
                <Menu size={19} />
              </button>
              <p className="truncate text-sm text-slate-500">
                <span className="hidden sm:inline">Workspace / </span>
                <span className="font-semibold text-slate-900">Dashboard</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={refreshData}
                disabled={refreshing}
                aria-label="Refresh dashboard data"
                title="Refresh dashboard data"
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:px-4 sm:text-sm"
              >
                <span className="sm:hidden">Website</span>
                <span className="hidden sm:inline">Back to website</span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-375 px-4 pb-10 pt-6 sm:px-7 sm:pt-8 lg:px-9 lg:pb-12">
          <section id="overview" className="scroll-mt-24">
            <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
                  <Sparkles size={14} />
                  Event management
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Dashboard overview
                </h1>
                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Monitor your events, guests, and revenue from one place.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 sm:w-auto"
                >
                  <Plus size={18} />
                  Create event
                </button>
              </div>
            </div>

            {pageError && (
              <div
                role="alert"
                className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
              >
                <span>{pageError}</span>
              </div>
            )}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, note, icon: Icon, tone, href }) => {
                const content = (
                  <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {label}
                        </p>
                        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                          {value}
                        </p>
                      </div>
                      <span
                        className={`grid size-11 place-items-center rounded-2xl ${iconTones[tone]}`}
                      >
                        <Icon size={20} />
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-medium text-slate-500">
                        {note}
                      </span>
                      {href ? (
                        <ArrowRight
                          size={15}
                          className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600"
                        />
                      ) : (
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                      )}
                    </div>
                  </div>
                );
                return href ? (
                  <Link key={label} to={href} className="block rounded-2xl">
                    {content}
                  </Link>
                ) : (
                  <div key={label}>{content}</div>
                );
              })}
            </div>
          </section>

          {formOpen && (
            <section id="event-form" className="mb-8 scroll-mt-24">
              <form
                onSubmit={submitEvent}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative flex items-center gap-3 border-b border-slate-100 bg-linear-to-r from-indigo-50/80 via-white to-white px-5 py-5 sm:px-7">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-indigo-100 text-indigo-700">
                    {editingId ? (
                      <CalendarDays size={20} />
                    ) : (
                      <CalendarPlus size={20} />
                    )}
                  </span>
                  <div className="pr-10">
                    <h2 className="text-lg font-bold text-slate-950">
                      {editingId ? "Edit event" : "Create an event"}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Add the details guests need to plan their visit.
                    </p>
                  </div>
                </div>

                <div className="grid min-w-0 gap-x-8 gap-y-7 px-4 py-5 sm:px-7 sm:py-6 xl:grid-cols-2">
                  <div className="space-y-5">
                    <div>
                      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Event details
                      </p>
                      <div className="space-y-4">
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">
                            Event name <span className="text-rose-500">*</span>
                          </span>
                          <input
                            required
                            maxLength={100}
                            autoFocus
                            value={form.name}
                            onChange={(event) =>
                              setForm((current) => ({
                                ...current,
                                name: event.target.value,
                              }))
                            }
                            placeholder="e.g. Founder's meetup"
                            className={inputClass}
                          />
                          <span className="mt-1 block text-right text-xs text-slate-400">
                            {form.name.length}/100
                          </span>
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">
                            Location <span className="text-rose-500">*</span>
                          </span>
                          <span className="relative block">
                            <MapPin
                              aria-hidden="true"
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                              size={17}
                            />
                            <input
                              required
                              maxLength={160}
                              value={form.location}
                              onChange={(event) =>
                                setForm((current) => ({
                                  ...current,
                                  location: event.target.value,
                                }))
                              }
                              placeholder="Venue or online location"
                              className={`${inputClass} pl-10`}
                            />
                          </span>
                        </label>
                      </div>
                    </div>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">
                        Description <span className="text-rose-500">*</span>
                      </span>
                      <textarea
                        required
                        maxLength={1000}
                        rows={5}
                        value={form.description}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Tell guests what to expect at your event..."
                        className={`${inputClass} resize-y`}
                      />
                      <span className="mt-1 block text-right text-xs text-slate-400">
                        {form.description.length}/1000
                      </span>
                    </label>
                  </div>

                  <div>
                    <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      Schedule
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Starts on <span className="text-rose-500">*</span>
                        </span>
                        <input
                          required
                          type="date"
                          min={editingId ? undefined : today}
                          value={form.startDate}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              startDate: event.target.value,
                            }))
                          }
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Start time <span className="text-rose-500">*</span>
                        </span>
                        <input
                          required
                          type="time"
                          value={form.startTime}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              startTime: event.target.value,
                            }))
                          }
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          Ends on <span className="text-rose-500">*</span>
                        </span>
                        <input
                          required
                          type="date"
                          min={
                            form.startDate || (editingId ? undefined : today)
                          }
                          value={form.endDate}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              endDate: event.target.value,
                            }))
                          }
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          End time <span className="text-rose-500">*</span>
                        </span>
                        <input
                          required
                          type="time"
                          value={form.endTime}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              endTime: event.target.value,
                            }))
                          }
                          className={inputClass}
                        />
                      </label>
                    </div>
                    <div className="mt-5 flex gap-3 rounded-xl bg-indigo-50/70 p-4 text-sm text-indigo-800">
                      <Clock3
                        className="mt-0.5 shrink-0 text-indigo-600"
                        size={17}
                      />
                      <p className="leading-5">
                        Event times use your local time zone. The end must be
                        after the start.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 px-5 py-4 sm:px-7">
                  {formError && (
                    <p
                      role="alert"
                      className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700"
                    >
                      {formError}
                    </p>
                  )}
                  <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={closeForm}
                      className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70"
                    >
                      {saving ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Saving...
                        </>
                      ) : (
                        <>
                          {editingId ? <Check size={17} /> : <Plus size={18} />}
                          {editingId ? "Save changes" : "Create event"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}

          <section
            id="events"
            className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="relative min-w-0 flex-1">
                  <Search
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />
                  <input
                    type="search"
                    aria-label="Search events"
                    placeholder="Search by event, venue, or description..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className={`${inputClass} py-2.5 pl-10`}
                  />
                </label>
                <label className="relative sm:w-48">
                  <ArrowDownUp
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <select
                    aria-label="Filter by event status"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className={`${inputClass} appearance-none py-2.5 pl-10 pr-9`}
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />
                </label>
              </div>
            </div>

            <div className="divide-y divide-slate-100 xl:hidden">
              {eventsLoading ? (
                <div className="px-5 py-14 text-center text-sm text-slate-500">
                  <span className="mx-auto mb-3 block size-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                  Loading events...
                </div>
              ) : filteredEvents.length ? (
                filteredEvents.map((event) => (
                  <article key={event.id} className="space-y-4 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/registrations/${event.id}`}
                          className="block truncate font-semibold text-slate-900 hover:text-indigo-700"
                        >
                          {event.name || "Untitled event"}
                        </Link>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {event.description || "No description"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          event.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            event.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {event.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="grid gap-3 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-2">
                      <div>
                        <p className="mb-1 font-semibold uppercase tracking-wide text-slate-400">
                          Schedule
                        </p>
                        <p className="font-medium text-slate-700">
                          {formatDate(event.startDate)}
                          {formatTime(event.startDate) &&
                            ` · ${formatTime(event.startDate)}`}
                        </p>
                        <p className="mt-1 text-slate-500">
                          Ends {formatDate(event.endDate)}
                          {formatTime(event.endDate) &&
                            ` · ${formatTime(event.endDate)}`}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="mb-1 font-semibold uppercase tracking-wide text-slate-400">
                          Location
                        </p>
                        <p className="flex items-center gap-1.5 text-slate-700">
                          <MapPin
                            size={14}
                            className="shrink-0 text-indigo-500"
                          />
                          <span className="truncate">
                            {event.location || "Not specified"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/passes/${event.id}`}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        View passes <Ticket size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditForm(event)}
                        aria-label={`Edit ${event.name}`}
                        className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <CalendarDays size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteEvent(event.id)}
                        disabled={deletingId === event.id}
                        aria-label={`Delete ${event.name}`}
                        className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      >
                        {deletingId === event.id ? (
                          <span className="size-4 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="px-5 py-12 text-center">
                  <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                    <CalendarDays size={22} />
                  </span>
                  <p className="font-semibold text-slate-700">
                    {events.length ? "No matching events" : "No events yet"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {events.length
                      ? "Try a different search or status filter."
                      : "Create an event to get your workspace started."}
                  </p>
                  {!events.length && (
                    <button
                      type="button"
                      onClick={openCreateForm}
                      className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      <Plus size={16} />
                      Create first event
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-212.5 text-left text-sm">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th scope="col" className="px-7 py-4 font-bold">
                      Event
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold">
                      Schedule
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold">
                      Location
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold">
                      Status
                    </th>
                    <th scope="col" className="px-7 py-4 text-right font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {eventsLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-7 py-16 text-center text-sm text-slate-500"
                      >
                        <span className="mx-auto mb-3 block size-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                        Loading events...
                      </td>
                    </tr>
                  ) : filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="group transition hover:bg-slate-50/70"
                      >
                        <td className="max-w-75 px-7 py-5">
                          <Link
                            to={`/registrations/${event.id}`}
                            className="block"
                          >
                            <p className="truncate font-semibold text-slate-900 transition group-hover:text-indigo-700">
                              {event.name || "Untitled event"}
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-500">
                              {event.description || "No description"}
                            </p>
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-4 py-5 text-slate-700">
                          <p className="font-medium">
                            {formatDate(event.startDate)}
                            {formatTime(event.startDate) && (
                              <span className="ml-2 text-xs font-normal text-slate-500">
                                {formatTime(event.startDate)}
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Ends {formatDate(event.endDate)}
                            {formatTime(event.endDate) &&
                              ` · ${formatTime(event.endDate)}`}
                          </p>
                        </td>
                        <td className="max-w-55 px-4 py-5 text-slate-600">
                          <span className="flex items-center gap-2">
                            <MapPin
                              size={15}
                              className="shrink-0 text-indigo-500"
                            />
                            <span className="truncate">
                              {event.location || "Not specified"}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              event.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                event.isActive
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />
                            {event.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-7 py-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/passes/${event.id}`}
                              aria-label={`View passes for ${event.name}`}
                              title="View passes"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                              Passes <Ticket size={14} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => openEditForm(event)}
                              aria-label={`Edit ${event.name}`}
                              title="Edit event"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                            >
                              <CalendarDays size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteEvent(event.id)}
                              disabled={deletingId === event.id}
                              aria-label={`Delete ${event.name}`}
                              title="Delete event"
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                            >
                              {deletingId === event.id ? (
                                <span className="block size-4 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-7 py-16 text-center">
                        <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                          <CalendarDays size={22} />
                        </span>
                        <p className="font-semibold text-slate-700">
                          {events.length
                            ? "No matching events"
                            : "No events yet"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {events.length
                            ? "Try a different search or status filter."
                            : "Create an event to get your workspace started."}
                        </p>
                        {!events.length && (
                          <button
                            type="button"
                            onClick={openCreateForm}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                          >
                            <Plus size={16} />
                            Create first event
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <span>
                Showing{" "}
                <strong className="text-slate-700">
                  {filteredEvents.length}
                </strong>{" "}
                of <strong className="text-slate-700">{events.length}</strong>{" "}
                events
              </span>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Adminpnanel;
