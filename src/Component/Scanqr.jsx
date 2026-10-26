import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  CircleAlert,
  ScanLine,
  ShieldCheck,
  Ticket,
  X,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

const API_URL = "http://192.168.1.64:3000";

function getAuthConfig() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function getVerificationStatus(payload) {
  const explicitResult = payload?.valid ?? payload?.isValid ?? payload?.success;
  if (typeof explicitResult === "boolean") return explicitResult;

  const status = String(payload?.status || "").toLowerCase();
  if (["valid", "verified", "success"].includes(status)) return true;
  if (["invalid", "rejected", "failed"].includes(status)) return false;
  return null;
}

export default function Scanqr() {
  const [qrToken, setQrToken] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [cameraStarting, setCameraStarting] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const scannerRef = useRef(null);
  const processingRef = useRef(false);
  const [count, setCount] = useState(null);
  const [countError, setCountError] = useState("");
  async function stopScanner() {
    const scanner = scannerRef.current;
    if (!scanner?.isScanning) {
      setCameraActive(false);
      return;
    }

    try {
      await scanner.stop();
      setCameraActive(false);
      await scanner.clear();
      scannerRef.current = null;
      setMessage("Camera stopped.");
      setMessageType("info");
    } catch (error) {
      setMessage(
        error.message || "The camera could not be stopped. Please try again.",
      );
      setMessageType("error");
    }
  }

  async function verifyCode(code) {
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      setMessage("Scan a ticket or enter its QR code before verifying.");
      setMessageType("error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Your session has expired. Please sign in again.");
      setMessageType("error");
      return;
    }

    setVerifying(true);
    setResult(null);
    setMessage("Checking this ticket...");
    setMessageType("info");

    try {
      const response = await axios.post(
        `${API_URL}/events/registrations/verify-qr`,
        { qrToken: normalizedCode },
        getAuthConfig(),
      );
      const payload = response.data;
      const isValid = getVerificationStatus(payload);

      setResult({ data: payload, isValid });
      setMessage(
        payload?.message ||
          (isValid === true
            ? "Ticket verified successfully."
            : isValid === false
              ? "This ticket could not be verified."
              : "Verification completed. Review the details below."),
      );
      setMessageType(
        isValid === true ? "success" : isValid === false ? "error" : "info",
      );
      void getScanCount();
    } catch (error) {
      const payload = error.response?.data;
      setResult(payload ? { data: payload, isValid: false } : null);
      setMessage(
        payload?.message ||
          error.message ||
          "Ticket verification failed. Check your connection and try again.",
      );
      setMessageType("error");
    } finally {
      setVerifying(false);
    }
  }

  async function startScanner() {
    setMessage("");
    setResult(null);
    setCameraStarting(true);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }
      if (scannerRef.current.isScanning) {
        setCameraStarting(false);
        setCameraActive(true);
        return;
      }

      const boxSize = Math.min(280, Math.max(180, window.innerWidth - 72));
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: boxSize, height: boxSize },
          aspectRatio: 1,
        },
        async (decodedText) => {
          if (processingRef.current) return;
          processingRef.current = true;
          setQrToken(decodedText);
          setMessage("QR code captured. Verifying ticket...");
          setMessageType("info");
          await stopScanner();
          await verifyCode(decodedText);
          processingRef.current = false;
        },
        () => {},
      );
      setCameraActive(true);
      setMessage("Camera is ready. Hold the QR code inside the frame.");
      setMessageType("info");
    } catch (error) {
      setCameraActive(false);
      setMessage(
        error.message?.toLowerCase().includes("permission")
          ? "Camera access was denied. Allow camera access in your browser settings, or enter the QR code manually."
          : error.message ||
              "Unable to start the camera. Check camera access and try again.",
      );
      setMessageType("error");
    } finally {
      setCameraStarting(false);
    }
  }

  const getScanCount = useCallback(async () => {
    setCountError("");
    try {
      const response = await axios.get(
        `${API_URL}/events/registrations/scan-count`,
        getAuthConfig(),
      );
      const nextCount = Number(response.data?.count ?? response.data);
      if (!Number.isInteger(nextCount) || nextCount < 0) {
        throw new Error("The scan count response was not a valid count.");
      }
      setCount(nextCount);
    } catch (error) {
      setCountError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load the scan count.",
      );
    }
  }, []);

  function resetScan() {
    setResult(null);
    setQrToken("");
    setMessage("");
    setMessageType("info");
  }

  useEffect(() => {
    void getScanCount();
    return () => {
      const scanner = scannerRef.current;
      if (scanner?.isScanning) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch((error) => {
            console.error("Unable to clean up QR scanner:", error);
          });
      }
    };
  }, [getScanCount]);

  return (
    <main className="min-h-screen bg-[#f5f6fa] px-4 pb-10 pt-6 text-slate-900 sm:px-6 sm:pt-8 lg:px-10">
      <style>{`
        #qr-reader { width: 100%; border: 0 !important; }
        #qr-reader video { width: 100% !important; max-height: 64vh; object-fit: cover; border-radius: 1rem; }
        #qr-reader__dashboard { padding-top: .75rem; }
        #qr-reader__dashboard_section_csr button { border: 1px solid #c7d2fe; border-radius: .65rem; background: #eef2ff; color: #4338ca; padding: .55rem .8rem; font-weight: 600; }
        #qr-reader__dashboard_section_csr select { max-width: 100%; border: 1px solid #e2e8f0; border-radius: .5rem; padding: .45rem; }
        #qr-reader__dashboard_section_swaplink { color: #4f46e5; }
        #qr-reader img { max-width: 100%; }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <Link
          to="/admin"
          className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-slate-500 transition hover:text-indigo-700"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <header className="mb-7">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
            <ScanLine size={15} />
            Door management
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Verify a ticket
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Scan an attendee’s ticket QR code or enter the code manually to
            check registration.
          </p>
          <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Ticket size={18} className="text-indigo-600" />
            <span className="text-sm font-medium text-slate-600">
              Ticket scans
            </span>
            <span className="text-lg font-bold text-slate-900">
              {count === null ? "—" : count}
            </span>
            {countError && (
              <span role="alert" className="text-xs text-rose-600">
                {countError}
              </span>
            )}
          </div>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
              <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Camera size={19} />
              </span>
              <div>
                <h2 className="font-bold text-slate-900">Camera scanner</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Use a camera-enabled device to scan a QR code.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="relative min-h-64 overflow-hidden rounded-2xl bg-slate-950 sm:min-h-80">
                <div
                  id="qr-reader"
                  className="mx-auto min-h-64 w-full max-w-xl overflow-hidden rounded-2xl sm:min-h-80"
                />
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
                    <span className="mb-4 grid size-16 place-items-center rounded-2xl border border-white/10 bg-white/5 text-indigo-200">
                      <ScanLine size={30} />
                    </span>
                    <p className="font-semibold text-white">
                      {cameraStarting ? "Starting camera..." : "Camera is off"}
                    </p>
                    <p className="mt-2 max-w-xs text-sm leading-5 text-slate-300">
                      {cameraStarting
                        ? "Please allow camera access when your browser asks."
                        : "Start the scanner and position the QR code in view."}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={startScanner}
                  disabled={cameraStarting || cameraActive || verifying}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Camera size={17} />
                  {cameraStarting ? "Starting camera..." : "Start camera"}
                </button>
                <button
                  type="button"
                  onClick={stopScanner}
                  disabled={!cameraActive}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <X size={17} />
                  Stop camera
                </button>
              </div>
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
                  <Ticket size={19} />
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Enter code manually
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Camera unavailable? Paste or type the QR value.
                  </p>
                </div>
              </div>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (scannerRef.current?.isScanning) {
                    await stopScanner();
                  }
                  await verifyCode(qrToken);
                }}
              >
                <label
                  htmlFor="qr-code"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  QR code
                </label>
                <textarea
                  id="qr-code"
                  rows={3}
                  value={qrToken}
                  onChange={(event) => setQrToken(event.target.value)}
                  disabled={verifying}
                  placeholder="Paste the ticket QR code here..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50"
                />
                <button
                  type="submit"
                  disabled={verifying || !qrToken.trim()}
                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {verifying ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Verifying ticket...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={17} />
                      Verify ticket
                    </>
                  )}
                </button>
              </form>
            </section>

            <section
              aria-live="polite"
              className={`rounded-2xl border p-5 sm:p-6 ${
                messageType === "success"
                  ? "border-emerald-200 bg-emerald-50"
                  : messageType === "error"
                    ? "border-rose-200 bg-rose-50"
                    : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                    messageType === "success"
                      ? "bg-emerald-100 text-emerald-700"
                      : messageType === "error"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  {messageType === "success" ? (
                    <CheckCircle2 size={19} />
                  ) : messageType === "error" ? (
                    <CircleAlert size={19} />
                  ) : (
                    <ShieldCheck size={19} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-slate-900">
                    Verification status
                  </h2>
                  <p className="mt-1  text-sm leading-5 text-slate-600">
                    {message ||
                      "A ticket verification result will appear here."}
                  </p>
                </div>
                {result && (
                  <button
                    type="button"
                    onClick={resetScan}
                    aria-label="Clear verification result"
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-white/70"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {result?.data &&
                (typeof result.data === "object" ? (
                  <dl className="mt-4 grid gap-2 border-t border-black/5 pt-4 sm:grid-cols-2">
                    {Object.entries(result.data).map(([key, value]) => (
                      <div
                        key={key}
                        className="min-w-0 rounded-lg bg-white/70 p-3"
                      >
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          {key.replace(/([A-Z])/g, " $1")}
                        </dt>
                        <dd className="mt-1  text-sm font-medium text-slate-800">
                          {formatValue(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="mt-4  border-t border-black/5 pt-4 text-sm text-slate-700">
                    {formatValue(result.data)}
                  </p>
                ))}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
