import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function IdentityProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    async function verifyToken() {
      const token = localStorage.getItem("registerToken");

      if (!token) {
        setValid(false);
        setChecking(false);
        return;
      }

      try {
        await axios.get(
          "http://192.168.1.64:3000/auth/register",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setValid(true);
      } catch (error) {
        console.log(
          "REGISTER TOKEN ERROR:",
          error.response?.status,
          error.response?.data
        );

        localStorage.removeItem("registerToken");
        setValid(false);
      } finally {
        setChecking(false);
      }
    }

    verifyToken();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying session...</p>
      </div>
    );
  }

  if (!valid) {
    return <Navigate to="/verifyemail" replace />;
  }

  return children;
}

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";

// export default function IdentityProtectedRoute({ children, requiredMethod }) {
//   const [checking, setChecking] = useState(true);
//   const [allowed, setAllowed] = useState(false);

//   useEffect(() => {
//     async function verifyAccess() {
//       const token = localStorage.getItem("registerToken");

//       if (!token) {
//         setAllowed(false);
//         setChecking(false);
//         return;
//       }

//       try {
//         const res = await axios.get(
//           "http://192.168.1.64:3000/auth/identity-status",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );

//         console.log("IDENTITY STATUS:", res.data);
//         if (
//           res.data.otpVerified &&
//           res.data.identityMethod === requiredMethod
//         ) {
//           setAllowed(true);
//         } else {
//           setAllowed(false);
//         }
//       } catch (error) {
//         console.log(
//           "IDENTITY PROTECTION ERROR:",
//           error.response?.status,
//           error.response?.data,
//         );

//         localStorage.removeItem("registerToken");

//         setAllowed(false);
//       } finally {
//         setChecking(false);
//       }
//     }

//     verifyAccess();
//   }, [requiredMethod]);

//   if (checking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

//           <p className="mt-4 text-gray-600">
//             Checking your verification session...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!allowed) {
//     return <Navigate to="/identity" replace />;
//   }

//   return children;
// }
