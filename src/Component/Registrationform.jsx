import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, Ticket, Users } from "lucide-react";

export default function Registrationform() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    attendeeName: "",
    email: "",
    phone: "",
    quantity: 1,
    passid: "",
    selectedDate: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getpass();
    getEvent();
    getprofile();
  }, [id]);

  function getpass() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    axios
      .get(`http://192.168.1.64:3000/events/${id}/passes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data);

        console.log("Passes:", res.data);
      })
      .catch((error) => {
        console.log(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");

          navigate("/login", { replace: true });
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to load passes. Please try again.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value,
    });

    setError("");
    setSuccess("");
  }

  function selectPass(passId) {
    setState({
      ...state,
      passid: passId,
    });

    setSuccess("");
    setError("");
  }

  function adduser(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!state.quantity || Number(state.quantity) < 1) {
      setError("Please enter a valid quantity.");
      return;
    }

    const selectedPass = data.find((pass) => pass.id === Number(state.passid));

    if (!selectedPass) {
      setError("Selected pass not found.");
      return;
    }

    const availableSlots =
      Number(selectedPass.totalSlots) - Number(selectedPass.soldSlots);

    if (Number(state.quantity) > availableSlots) {
      setError(`Only ${availableSlots} slots are available for this pass.`);
      return;
    }

    const isoDate = `${state.selectedDate}T00:00:00.000Z`;

    setRegistering(true);

    axios
      .post(
        `http://192.168.1.64:3000/events/${id}/register`,
        {
          attendeeName: state.attendeeName.trim(),
          email: state.email.trim(),
          phone: state.phone.trim(),
          quantity: Number(state.quantity),
          passId: Number(state.passid),
          selectedDate: isoDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log("Registration successful:", res.data);

        setSuccess(
          "Registration successful! Your event registration has been created.",
        );

        navigate(`/payment/${res.data.id}`)


        setState({
          attendeeName: "",
          email: "",
          phone: "",
          quantity: 1,
          passid: "",
          selectedDate: "",
        });
      })
      .catch((error) => {
        console.log("Registration error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");

          navigate("/login", { replace: true });
          return;
        }

        setError(
          error.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      })
      .finally(() => {
        setRegistering(false);
      });
  }

  function getEvent() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    axios
      .get(`http://192.168.1.64:3000/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Event:", res.data);
        setEvent(res.data);
      })
      .catch((error) => {
        console.log(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login", { replace: true });
          return;
        }

        setError(error.response?.data?.message || "Unable to load event.");
      });
  }

  function getprofile() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    axios
      .get("http://192.168.1.64:3000/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const profile = res.data;

        setState((prev) => ({
          ...prev,
          attendeeName: `${profile.firstName || ""} ${
            profile.lastName || ""
          }`.trim(),
          email: profile.email || "",
          phone: profile.phone || "",
        }));
      })
      .catch((error) => {
        console.log("Profile error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");

          navigate("/login", { replace: true });
        }
      });
  }

  return (
    <section className="min-h-screen bg-[#f4f6ef] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#47735b]">
            <Ticket className="h-4 w-4" />
            Event Registration
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#14251f] sm:text-4xl">
            Register for your event
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#65736b] sm:text-base">
            Select your preferred pass and enter your details to complete your
            registration.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <span className="font-medium">{success}</span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#14251f]">
                  Choose your pass
                </h2>

                <p className="mt-1 text-sm text-[#748078]">
                  Select one pass to continue
                </p>
              </div>

              <span className="rounded-full bg-[#e3eee1] px-3 py-1 text-xs font-bold text-[#47735b]">
                {data.length} Pass{data.length !== 1 ? "es" : ""}
              </span>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-[#e0e5dc] bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-[#748078]">Loading passes...</p>
              </div>
            ) : data.length === 0 ? (
              <div className="rounded-2xl border border-[#e0e5dc] bg-white p-8 text-center shadow-sm">
                <Ticket className="mx-auto h-10 w-10 text-[#9aaa9f]" />

                <h3 className="mt-4 font-bold text-[#14251f]">
                  No passes available
                </h3>

                <p className="mt-2 text-sm text-[#748078]">
                  There are currently no passes available for this event.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.map((pass) => {
                  const availableSlots =
                    Number(pass.totalSlots) - Number(pass.soldSlots);

                  const isSelected = Number(state.passid) === Number(pass.id);

                  const isSoldOut =
                    availableSlots <= 0 || pass.isActive === false;

                  return (
                    <button
                      type="button"
                      key={pass.id}
                      disabled={isSoldOut}
                      onClick={() => selectPass(pass.id)}
                      className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition duration-200 ${
                        isSoldOut
                          ? "cursor-not-allowed border-gray-200 opacity-60"
                          : isSelected
                            ? "border-[#47735b] bg-[#f5faf3] shadow-md"
                            : "border-[#e0e5dc] hover:-translate-y-0.5 hover:border-[#9db8a3] hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              isSelected
                                ? "bg-[#173d32] text-white"
                                : "bg-[#e8f0e6] text-[#47735b]"
                            }`}
                          >
                            <Ticket className="h-5 w-5" />
                          </div>

                          <div>
                            <h3 className="font-bold text-[#14251f]">
                              {pass.name}
                            </h3>

                            {pass.description && (
                              <p className="mt-1 text-sm text-[#748078]">
                                {pass.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-[#47735b]">
                            ₹{pass.price}
                          </p>

                          {isSoldOut && (
                            <span className="mt-1 inline-block text-xs font-bold text-red-500">
                              Sold out
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-[#f4f6ef] p-3">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#47735b]" />

                            <span className="text-xs text-[#748078]">
                              Available
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-bold text-[#14251f]">
                            {availableSlots} slots
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#f4f6ef] p-3">
                          <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4 text-[#47735b]" />

                            <span className="text-xs text-[#748078]">
                              Booked
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-bold text-[#14251f]">
                            {pass.soldSlots} slots
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#47735b]">
                          <CheckCircle2 className="h-4 w-4" />
                          Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-6 rounded-2xl border border-[#e0e5dc] bg-white p-6 shadow-[0_12px_30px_rgba(35,57,45,0.08)] sm:p-7">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#14251f]">
                  Your details
                </h2>

                <p className="mt-1 text-sm text-[#748078]">
                  Enter your information to register.
                </p>
              </div>

              {state.passid && (
                <div className="mb-6 rounded-xl bg-[#f4f6ef] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#748078]">
                    Selected pass
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-bold text-[#14251f]">
                      {
                        data.find(
                          (pass) => Number(pass.id) === Number(state.passid),
                        )?.name
                      }
                    </p>

                    <p className="font-bold text-[#47735b]">
                      ₹
                      {
                        data.find(
                          (pass) => Number(pass.id) === Number(state.passid),
                        )?.price
                      }
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={adduser} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#14251f]">
                    Attendee Name
                  </label>

                  <input
                    type="text"
                    name="attendeeName"
                    placeholder="Enter your name"
                    value={state.attendeeName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d5ddd1] bg-white px-4 py-3 text-sm text-[#14251f] outline-none transition placeholder:text-[#9aa59f] focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#14251f]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={state.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d5ddd1] bg-white px-4 py-3 text-sm text-[#14251f] outline-none transition placeholder:text-[#9aa59f] focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#14251f]">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={state.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d5ddd1] bg-white px-4 py-3 text-sm text-[#14251f] outline-none transition placeholder:text-[#9aa59f] focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#14251f]">
                    Select Date
                  </label>

                  <div className="relative">
                    <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#47735b]" />

                    <input
                      type="date"
                      name="selectedDate"
                      value={state.selectedDate}
                      min={event?.startDate ? event.startDate.slice(0, 10) : ""}
                      max={event?.endDate ? event.endDate.slice(0, 10) : ""}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-[#d5ddd1] bg-white py-3 pl-11 pr-4 text-sm text-[#14251f] outline-none transition focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#14251f]">
                    Number of Tickets
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    placeholder="Enter quantity"
                    value={state.quantity}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d5ddd1] bg-white px-4 py-3 text-sm text-[#14251f] outline-none transition placeholder:text-[#9aa59f] focus:border-[#47735b] focus:ring-2 focus:ring-[#47735b]/10"
                  />
                </div>

                {success && (
                  <div>
                    {/* <Link to="/payment"> */}
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173d32] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#285b49]"
                      >
                        Payment
                      </button>
                    {/* </Link> */}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={registering || !state.passid}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173d32] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#285b49] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {registering ? (
                    "Registering..."
                  ) : (
                    <>
                      Complete Registration
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
