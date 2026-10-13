import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Identify() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    name: "",
    dob: "",
    gender: "",
    address: "",
    mobile: "",
    email: "",
    maskedRef: "",
    verifiedAt: "",
  });

  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

  function createuser(selectedMethod) {
    setMethod(selectedMethod);
  }

  async function handleContinue() {
    const token = localStorage.getItem("registerToken");

    if (!token) {
      navigate("/verifyemail", { replace: true });
      return;
    }

    if (!method) {
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://192.168.1.64:3000/auth/identity-verification",
        {
          ...state,
          method: method,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("IDENTITY RESPONSE:", res.data);

      if (res.data) {
        setState((prevState) => ({
          ...prevState,
          ...res.data,
        }));
      }

      const sessionId = res.data.sessionId;
      if (!sessionId) {
        console.log("Session ID not received");
        return;
      }

      if (method === "aadhaar") {
        navigate(`/aadhar/${sessionId}`);
      } else if (method === "digilocker") {
        navigate(`/digilocker/${sessionId}`);
      } else if (method === "maadhaar") {
        navigate(`/mAadhar/${sessionId}`);
      }
    } catch (error) {
      console.log(
        "IDENTITY ERROR:",
        error.response?.status,
        error.response?.data,
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("registerToken");

        navigate("/verifyemail", { replace: true });
        return;
      }

      console.log("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-end px-6 sm:px-10 md:px-16 py-8 mt-10"
      style={{
        backgroundImage: "url('/images/Temple1.jpg')",
      }}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Identity Verification
          </h1>

          <p className="mt-2 text-gray-500 text-sm sm:text-base">
            Choose a verification method to continue
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
          <div
            onClick={() => createuser("aadhaar")}
            className={`cursor-pointer rounded-lg border p-4 mb-4 transition ${
              method === "aadhaar"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-blue-500"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
                🪪
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Aadhaar Card
                  </h2>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      method === "aadhaar"
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {method === "aadhaar" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Enter your 12-digit Aadhaar number and confirm the OTP sent to
                  the mobile number linked with your Aadhaar.
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => createuser("digilocker")}
            className={`cursor-pointer rounded-lg border p-4 mb-4 transition ${
              method === "digilocker"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-blue-500"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-lg bg-green-100 flex items-center justify-center text-2xl">
                📁
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    DigiLocker
                  </h2>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      method === "digilocker"
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {method === "digilocker" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Fetch your identity from your DigiLocker account. Sign in and
                  approve sharing your Aadhaar details.
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => createuser("maadhaar")}
            className={`cursor-pointer rounded-lg border p-4 transition ${
              method === "maadhaar"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-blue-500"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-lg bg-purple-100 flex items-center justify-center text-2xl">
                📱
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    mAadhaar App
                  </h2>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      method === "maadhaar"
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {method === "maadhaar" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Scan a QR code using the mAadhaar app. Best if you already use
                  mAadhaar and want to include face authentication.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate("/verifyemail")}
            className="w-full sm:w-1/2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition duration-200"
          >
            Back
          </button>

          <button
            type="button"
            disabled={!method || loading}
            onClick={handleContinue}
            className={`w-full sm:w-1/2 font-semibold py-3 rounded-lg transition duration-200 ${
              method && !loading
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
