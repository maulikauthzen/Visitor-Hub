import { Button } from "@base-ui/react/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";

export default function Payment() {
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    getdata();
  }, [id]);

  function getdata() {
    const token = localStorage.getItem("token");

    axios
      .get(`http://192.168.1.64:3000/payment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setState(res.data);
        console.log("Payment data:", res.data);
      })
      .catch((error) => {
        console.log("GET payment error:", error);
      });
  }

  function postpayment() {
    const token = localStorage.getItem("token");

    setLoading(true);

    axios
      .post(
        "http://192.168.1.64:3000/payment",
        {
          id: state.id,
          amount: state.amount,
          status: state.status,
          userId: state.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("Payment response:", res.data);

        setState(res.data.paymentDetails);
      })
      .catch((error) => {
        console.log("POST payment error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-[#f4f6ef] px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          
          {/* Header */}
          <div className="bg-[#173d32] px-6 py-8 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <CreditCard size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Payment Details
                </h1>

                <p className="mt-1 text-sm text-white/70">
                  Review your payment information
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8">
            <div className="space-y-4">

              {/* Name */}
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Attendee
                    </p>

                    <p className="font-semibold text-gray-900">
                      {state.attendeeName || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Phone size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Phone
                    </p>

                    <p className="font-semibold text-gray-900">
                      {state.phone || "-"}
                    </p>
                  </div>
                </div>
              </div>

             

              {/* Selected Date */}
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Selected Date
                    </p>

                    <p className="font-semibold text-gray-900">
                      {state.selectedDate || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <IndianRupee size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Amount
                    </p>

                    <p className="text-xl font-bold text-gray-900">
                      ₹{state.amount || "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div
                className={`flex items-center justify-between rounded-2xl p-4 ${
                  state.status === "confirmed"
                    ? "bg-green-50"
                    : "bg-yellow-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      state.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {state.status === "confirmed" ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <CreditCard size={20} />
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Payment Status
                    </p>

                    <p
                      className={`font-bold capitalize ${
                        state.status === "confirmed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {state.status || "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-8">
              {state.status === "confirmed" ? (
                <Link to="/registraions" className="block">
                  <Button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173d32] px-6 py-3 font-semibold text-white hover:bg-[#0f3027]">
                    <CheckCircle2 size={20} />
                    Back to Registrations
                  </Button>
                </Link>
              ) : (
                <button
                  onClick={postpayment}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173d32] px-6 py-3 font-semibold text-white transition hover:bg-[#0f3027] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Confirm & Pay
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Success message */}
            {state.status === "confirmed" && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CheckCircle2 size={18} />
                Payment confirmed successfully
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}