import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Landingpage from "./Component/Landingpage";
import Navbar from "./Component/Navbar";
import Login from "./Component/Login";
import Register from "./Component/Register";
import Verifyemail from "./Component/Verifyemail";
import Adminpnanel from "./Component/Adminpnanel";
import Protectedroute from "./Component/Protectedroute";
import Mainpage from "./Component/Mainpage";
import Unauthorized from "./Component/Unauthorized";
// import Maadhar from "./Identify/Maadhar";
// import Aadhar from "./Identify/Aadhar";
// import Digilocker from "./Identify/Digilocker";
// import Identify from "./Component/Identity";
// import IdentityProtectedRoute from "./Identify/IdentityProtectedRoute";
import Passes from "./Component/Passes";
import Registreduser from "./Component/Registreduser";
import Registrationform from "./Component/Registrationform";
import Profile from "./Component/Profile";
import Registrations from "./Component/Registrations";
import TotalregUser from "./Component/TotalregUser";
import Payment from "./Component/Payment";
import Viewregs from "./Component/Viewregs";
import View from "./Component/View";
import Scanqr from "./Component/Scanqr";
import Aboutus from "./Component/Aboutus";
import Contact from "./Component/Contact";
import Deletedevents from "./Component/Deletedevents";
import Deletedpass from "./Component/Deletedpass";
import Deletedregs from "./Component/Deletedregs";
import Deletedthings from "./Component/Deletedthings";

function App() {
  const location = useLocation();
  const hideNavbar =
    [
      "/admin",
      "/allreguser",
      "/scanqr",
      "/profile",
      "/deletedevents",
      "/deletedpass",
      "/deletedregs",
      "/registraions",
    ].includes(location.pathname) ||
    location.pathname.startsWith("/registrations/") ||
    location.pathname.startsWith("/deletedthings");

  return (
    <div>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/verifyemail" element={<Verifyemail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <Protectedroute allowedRole={["admin"]}>
              <Adminpnanel />
            </Protectedroute>
          }
        />
        <Route
          path="/passes/:id"
          element={
            <Protectedroute allowedRole={["admin"]}>
              <Passes />
            </Protectedroute>
          }
        />
        <Route
          path="/registrations/:id"
          element={
            <Protectedroute allowedRole={["admin"]}>
              <Registreduser />
            </Protectedroute>
          }
        />
        <Route
          path="/allreguser"
          element={
            <Protectedroute allowedRole={["admin"]}>
              <TotalregUser />
            </Protectedroute>
          }
        />

        {/* <Route
          path="/deletedevents"
          element={
            <Protectedroute allowedRole={["admin"]}>
              <Deletedevents />
            </Protectedroute>
          }
        /> */}
        {/* <Route
          path="/deletedpass"
          element={
            <Protectedroute allowedRole={["admin"]}>
              <Deletedpass />
            </Protectedroute>
          }
        /> */}

        <Route
          path="/deletedthings"
          element={
            <Protectedroute allowedRole={["admin"]}>
              <Deletedthings />
            </Protectedroute>
          }
        >
          <Route index element={<Navigate to="events" replace />} />

          <Route path="events" element={<Deletedevents />} />

          <Route path="passes" element={<Deletedpass />} />

          <Route path="registrations" element={<Deletedregs />} />
        </Route>
        

        <Route
          path="/regstrationform/:id"
          element={
            <Protectedroute allowedRole={["user", "admin"]}>
              <Registrationform />
            </Protectedroute>
          }
        />

        <Route
          path="/reguser/:id"
          element={
            <Protectedroute allowedRole={["admin"]}>
              <Viewregs />
            </Protectedroute>
          }
        />
        <Route
          path="/view/:id"
          element={
            <Protectedroute allowedRole={["user", "admin"]}>
              <View />
            </Protectedroute>
          }
        />

        <Route
          path="/scanqr"
          element={
            <Protectedroute allowedRole={["admin"]}>
              <Scanqr />
            </Protectedroute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/registraions" element={<Registrations />} />

        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contactus" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
