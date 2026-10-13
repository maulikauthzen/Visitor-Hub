import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Maadhar() {
  const [state, setState] = useState({});
  const { sessionId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("registerToken");

    if (!token) {
      console.log("Register token not found");
      return;
    }

    axios
      .get(
        `http://192.168.1.64:3000/auth/verification/${sessionId}/qr`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("QR RESPONSE:", res.data);
        setState(res.data);
      })
      .catch((error) => {
        console.log(
          "QR ERROR:",
          error.response?.status,
          error.response?.data
        );
      });
  }, [sessionId]);

  return (
    <div>
      <h2>mAadhaar Verification</h2>

      {state.qrImage && (
        <img
          src={state.qrImage}
          alt="mAadhaar QR"
          className="w-64 h-64"
        />
      )}

      <p>{state.qrValue}</p>
    </div>
  );
}