import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Ticket,
  CalendarDays,
  MapPin,
  IndianRupee,
  Users,
  ArrowLeft,
} from "lucide-react";

export default function Viewregs() {
  const [state, setState] = useState({});
  const { id } = useParams();

  useEffect(() => {
    viewregs();
  }, [id]);

  function viewregs() {
    const token = localStorage.getItem("token");

    axios
      .get(`http://192.168.1.64:3000/events/registrations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("REGISTRATION DATA:", res.data);
        setState(res.data);
      })
      .catch((error) => {
        console.log("ERROR:", error.response?.data);
      });
  }

  function formatDate(date) {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatDateTime(date) {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (!state.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading registration details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition hover:bg-white hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="bg-green-800 px-6 py-5">
            <p className="mb-1 text-sm font-medium text-green-100">Event</p>

            <h2 className="text-2xl font-bold text-white">
              {state.event?.name}
            </h2>
          </div>

          <div className="p-6">
            <p className="mb-6 text-gray-600">{state.event?.description}</p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location</p>

                  <p className="font-medium text-gray-900">
                    {state.event?.location || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Start Date</p>

                  <p className="font-medium text-gray-900">
                    {formatDateTime(state.event?.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">End Date</p>

                  <p className="font-medium text-gray-900">
                    {formatDateTime(state.event?.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <User size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Attendee Information
                </h2>

                <p className="text-sm text-gray-500">Personal details</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <User size={19} className="text-gray-400" />

                <div>
                  <p className="text-sm text-gray-500">Full Name</p>

                  <p className="font-semibold text-gray-900">
                    {state.attendeeName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <Mail size={19} className="text-gray-400" />

                <div>
                  <p className="text-sm text-gray-500">Email</p>

                  <p className="font-semibold text-gray-900">{state.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone size={19} className="text-gray-400" />

                <div>
                  <p className="text-sm text-gray-500">Phone</p>

                  <p className="font-semibold text-gray-900">{state.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Ticket size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Pass Information
                </h2>

                <p className="text-sm text-gray-500">Selected pass details</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm text-gray-500">Pass Name</p>

                  <p className="font-semibold text-gray-900">
                    {state.pass?.name}
                  </p>
                </div>

                <Ticket size={20} className="text-green-700" />
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm text-gray-500">Pass Price</p>

                  <p className="font-semibold text-gray-900">
                    ₹{state.pass?.price}
                  </p>
                </div>

                <IndianRupee size={20} className="text-green-700" />
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>

                  <p className="font-semibold text-gray-900">
                    {state.quantity}
                  </p>
                </div>

                <Users size={20} className="text-green-700" />
              </div>

              {/* <div>
                <p className="text-sm text-gray-500">Amount</p>

                <p className="font-semibold text-gray-900">{state.amount}</p>
              </div> */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>

                  <p className="font-semibold text-gray-900">
                    {state.amount}
                  </p>
                </div>

                <IndianRupee size={20} className="text-green-700" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Selected Date</p>

                  <p className="font-semibold text-gray-900">
                    {formatDate(state.selectedDate)}
                  </p>
                </div>

                <CalendarDays size={20} className="text-green-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
