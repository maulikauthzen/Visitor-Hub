import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  CircleAlert,
  LoaderCircle,
  Phone,
  RefreshCw,
  Ticket,
  IndianRupee,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Registrations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getdata();
  }, []);

  function getdata() {
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(false);

    axios
      .get("http://192.168.1.64:3000/user/registered-events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setData(res.data);
          console.log(res.data);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setData([]);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  return (
    <main className="min-h-screen bg-[#f4f6ef] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-[#dce3da] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#477565]">
              My account
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#172923] sm:text-4xl">
              My registrations
            </h1>
            <p className="mt-2 text-sm text-[#617169]">
              Keep track of your event bookings and attendee details.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-lg border border-[#dce3da] bg-white px-4 py-3 sm:self-auto">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#e9f1eb] text-[#245a47]">
              <Ticket className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-bold leading-none text-[#172923]">
                {data.length}
              </p>
              <p className="mt-1 text-xs text-[#617169]">
                {data.length === 1 ? "registration" : "registrations"}
              </p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-[#e2e8e1] bg-white text-[#617169]">
            <LoaderCircle className="h-7 w-7 animate-spin text-[#245a47]" />
            <p className="text-sm">Loading your registrations...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <CircleAlert className="mb-3 h-8 w-8 text-rose-600" />
            <h2 className="text-lg font-semibold text-[#172923]">
              We couldn’t load your registrations
            </h2>
            <p className="mt-1 text-sm text-[#617169]">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={getdata}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#173d32] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#245a47] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245a47]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        ) : data.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[#cbd7ce] bg-white px-6 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#e9f1eb] text-[#245a47]">
              <Ticket className="h-7 w-7" />
            </span>
            <h2 className="text-lg font-semibold text-[#172923]">
              No registrations yet
            </h2>
            <p className="mt-1 text-sm text-[#617169]">
              Your event bookings will appear here.
            </p>
          </div>
        ) : (
          <section
            aria-label="Event registrations"
            className="overflow-hidden rounded-lg border border-[#dce3da] bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-[#e8ede8] px-5 py-4">
              <div>
                <h2 className="font-semibold text-[#172923]">Your bookings</h2>
                <p className="mt-0.5 text-xs text-[#718078]">
                  {data.length} {data.length === 1 ? "event" : "events"}{" "}
                  registered
                </p>
              </div>
              <Ticket className="h-5 w-5 text-[#477565]" aria-hidden="true" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-1000px border-collapse text-left text-sm">
                <thead className="bg-[#f5f7f4] text-xs font-semibold uppercase tracking-wide text-[#617169]">
                  <tr>
                    <th scope="col" className="px-5 py-3">
                      Event
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Attendee
                    </th>
                    {/* <th scope="col" className="px-5 py-3">
                      Contact
                    </th> */}

                    <th scope="col" className="px-5 py-3 text-center">
                      Tickets
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Total
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Registered
                    </th>
                    <th scope="col" className="px-5 py-3">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0ed]">
                  {data.map((el, index) => (
                    <tr
                      key={el._id || el.id || `${el.event?.name}-${index}`}
                      className="transition-colors hover:bg-[#f8faf7]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#e9f1eb] text-[#245a47]">
                            <CalendarDays className="h-4 w-4" />
                          </span>
                          <span className="font-semibold text-[#172923]">
                            {el.event?.name || "Event"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-[#34443c]">
                        {el.attendeeName || "—"}
                      </td>
                      {/* <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap text-[#53645b]">
                          <Phone className="h-4 w-4 text-[#829087]" />
                          {el.phone || "—"}
                        </span>
                      </td> */}
                      <td className="px-5 py-4 text-center font-medium text-[#34443c]">
                        {el.quantity ?? "—"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-semibold text-[#172923]">
                        <span className="inline-flex items-center">
                          <IndianRupee className="mr-0.5 h-4 w-4" />
                          {el.amount ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full bg-[#e9f3eb] px-2.5 py-1 text-xs font-semibold capitalize text-[#286244]">
                          {el.status || "Registered"}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[#53645b]">
                        {formatDate(el.selectedDate)}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-[#53645b]">
                        <Link
                          to={`/view/${el.id}`}
                          className="font-semibold text-[#245a47] hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
