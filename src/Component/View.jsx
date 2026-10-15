import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  QrCode,
  Ticket,
  User,
  Users,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function View() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    getdata();
  }, [id]);

  function getdata() {
    const token = localStorage.getItem("token");

    setLoading(true);
    setError(false);

    axios
      .get(`http://192.168.1.64:3000/user/registered-events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        setData({});
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatCreatedDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7f2] px-4 py-10">
        <div
          className="flex flex-col items-center gap-4 rounded-3xl border border-[#e3ebe4] bg-white px-8 py-10 text-center shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf2eb]">
            <Ticket className="h-6 w-6 animate-pulse text-[#245a47]" />
          </div>
          <div>
            <p className="font-semibold text-[#172923]">
              Getting your pass ready
            </p>
            <p className="mt-1 text-sm text-[#718078]">
              Loading registration details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7f2] px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-[#e3ebe4] bg-white p-7 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <Ticket className="h-6 w-6" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[#172923]">
            Registration not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#617169]">
            We couldn't load this registration. Please try again.
          </p>

          <Link
            to="/registraions"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#173d32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245a47] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245a47]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to registrations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7f2] px-4 py-7 sm:px-6 sm:py-10 lg:px-8 mt-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/registraions"
          className="mb-7 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-[#477565] transition hover:text-[#173d32] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#245a47]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          My registrations
        </Link>

        <header className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#477565]">
              Registration details
            </p>
            <h1 className="wrap-break-word text-3xl font-bold tracking-tight text-[#172923] sm:text-4xl">
              {data.event?.name || "Your event pass"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#617169]">
              Your booking information and entry pass, all in one place.
            </p>
          </div>

          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#cfe3d3] bg-[#e8f3e9] px-3.5 py-2 text-sm font-semibold capitalize text-[#286244]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {data.status || "Confirmed"}
          </span>
        </header>

        <section
          aria-labelledby="event-heading"
          className="overflow-hidden rounded-3xl border border-[#dce7dd] bg-white shadow-[0_18px_50px_-32px_rgba(23,61,50,0.35)]"
        >
          <div className="relative overflow-hidden bg-linear-to-br from-[#173d32] via-[#1c4a3c] to-[#28634d] px-5 py-7 text-white sm:px-8 sm:py-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -top-14 h-44 w-44 rounded-full border border-white/10"
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c4d9cb]">
                  Your event
                </p>
                <h2
                  id="event-heading"
                  className="mt-2 wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl"
                >
                  {data.event?.name || "Event"}
                </h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#d3e2d7]">
                  <CalendarDays
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {formatDate(data.selectedDate)}
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#d6e7d8]">
                <Ticket className="h-7 w-7" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="grid divide-y divide-[#edf1ed] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-3 px-5 py-5 sm:px-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#245a47]">
                <Ticket className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-[#829087]">
                  Pass type
                </p>
                <p className="mt-1 truncate font-semibold text-[#172923]">
                  {data.pass?.name || "General Pass"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-5 sm:px-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#245a47]">
                <Users className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#829087]">
                  Tickets
                </p>
                <p className="mt-1 font-semibold text-[#172923]">
                  {data.quantity ?? 0}{" "}
                  {data.quantity === 1 ? "ticket" : "tickets"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-5 sm:px-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#245a47]">
                <Clock3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#829087]">
                  Booked on
                </p>
                <p className="mt-1 font-semibold text-[#172923]">
                  {formatCreatedDate(data.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section
            aria-labelledby="attendee-heading"
            className="rounded-3xl border border-[#e1e9e1] bg-white p-5 shadow-sm sm:p-7 lg:col-span-2"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#245a47]">
                <User className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 id="attendee-heading" className="font-bold text-[#172923]">
                  Attendee details
                </h2>
                <p className="mt-0.5 text-xs text-[#718078]">
                  Information provided during registration
                </p>
              </div>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-2xl bg-[#f7f9f6] p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-[#829087]">
                  Full name
                </dt>
                <dd className="mt-2 wrap-break-word font-semibold text-[#172923]">
                  {data.attendeeName || "—"}
                </dd>
              </div>
              <div className="min-w-0 rounded-2xl bg-[#f7f9f6] p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-[#829087]">
                  Email address
                </dt>
                <dd className="mt-2 flex min-w-0 items-start gap-2 font-semibold text-[#172923]">
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#477565]"
                    aria-hidden="true"
                  />
                  <span className="break-all">{data.email || "—"}</span>
                </dd>
              </div>
              <div className="min-w-0 rounded-2xl bg-[#f7f9f6] p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-[#829087]">
                  Phone number
                </dt>
                <dd className="mt-2 flex min-w-0 items-start gap-2 font-semibold text-[#172923]">
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#477565]"
                    aria-hidden="true"
                  />
                  <span className="wrap-break-word">{data.phone || "—"}</span>
                </dd>
              </div>
            </dl>
          </section>

          <aside className="flex flex-col rounded-3xl border border-[#dce7dd] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#245a47]">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-bold text-[#172923]">Payment summary</h2>
                <p className="mt-0.5 text-xs text-[#718078]">Booking total</p>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between gap-3 border-t border-dashed border-[#dce5dd] pt-5">
              <span className="text-sm font-medium text-[#617169]">
                Total paid
              </span>
              <span className="text-2xl font-bold tracking-tight text-[#173d32]">
                ₹{data.amount || "0.00"}
              </span>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#829087]">
              Keep this registration pass handy when you arrive at the event.
            </p>
          </aside>
        </div>

        <section
          aria-labelledby="entry-pass-heading"
          className="mt-6 overflow-hidden rounded-3xl border border-[#dce7dd] bg-white shadow-sm"
        >
          <div className="grid items-center gap-6 p-5 sm:p-7 md:grid-cols-[1fr_auto] md:gap-10">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf4ee] text-[#245a47]">
                  <QrCode className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2
                    id="entry-pass-heading"
                    className="font-bold text-[#172923]"
                  >
                    Entry pass
                  </h2>
                  <p className="mt-0.5 text-xs text-[#718078]">
                    Scan this QR code at the event
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#617169]">
                Show your QR code at the entrance to validate your registration.
              </p>
              <p className="mt-4 inline-flex max-w-full items-center rounded-lg bg-[#f3f7f3] px-3 py-2 text-sm font-semibold text-[#173d32]">
                <span className="mr-1 text-[#718078]">Registration ID</span>
                <span className="break-all">#{data.id}</span>
              </p>
            </div>

            <div className="mx-auto flex min-h-48 w-full max-w-56 items-center justify-center rounded-2xl border border-[#e2eae2] bg-[#fbfcfa] p-4 md:mx-0">
              {data.qrToken ? (
                <QRCodeSVG
                  value={String(data.qrToken)}
                  size={176}
                  level="H"
                  includeMargin
                  className="h-auto max-w-full"
                  aria-label="Registration entry QR code"
                />
              ) : (
                <p className="text-center text-sm text-[#718078]">
                  QR pass is not available for this registration.
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="mt-7 flex justify-center pb-4">
          <Link
            to="/registraions"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d4e0d5] bg-white px-5 py-2.5 text-sm font-semibold text-[#245a47] transition hover:border-[#b9cebd] hover:bg-[#f8faf7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245a47]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to my registrations
          </Link>
        </div>
      </div>
    </main>
  );
}
