import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, ShieldCheck, UserRound, X } from "lucide-react";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!token) {
      setProfile({});
      return;
    }

    axios
      .get("http://192.168.1.64:3000/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setProfile(response.data))
      .catch((error) => {
        console.error("Unable to load profile for navbar:", error);
      });
  }, [token]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  const navItems = [
    { label: "Home", to: "/", active: location.pathname === "/" },
    
    ...(token
      ? [
          {
            label: "My events",
            to: "/registraions",
            active: location.pathname === "/registraions",
          },
        ]
      : []),
    ...(token && role === "admin"
      ? [
          {
            label: "Admin",
            to: "/admin",
            active: location.pathname === "/admin",
            icon: <ShieldCheck size={15} aria-hidden="true" />,
          },
        ]
      : []),
  ];

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Main navigation"
        className="border-b border-[#17352b]/10 bg-white/95 shadow-[0_3px_18px_rgba(20,37,31,0.06)] backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            aria-label="VisitorHub home"
            onClick={closeMenu}
            className="group inline-flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a3f] focus-visible:ring-offset-2"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#17352b] text-sm font-extrabold text-[#f0c879] shadow-sm transition-transform duration-200 group-hover:-rotate-3">
              V
            </span>
            <span className="text-[1.15rem] font-bold tracking-tight text-[#17352b]">
              Visitor<span className="text-[#b98a3f]">Hub</span>
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center lg:flex">
            <ul className="flex items-center gap-1 rounded-full border border-[#17352b]/[0.07] bg-[#f6f7f3] p-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    aria-current={item.active ? "page" : undefined}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a3f] focus-visible:ring-offset-2 ${
                      item.active
                        ? "bg-white text-[#17352b] shadow-sm"
                        : "text-[#68746d] hover:text-[#17352b]"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {token ? (
              <>
                <Link
                  to="/profile"
                  aria-label="Open your profile"
                  aria-current={
                    location.pathname === "/profile" ? "page" : undefined
                  }
                  className="group inline-flex min-h-10 items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-[#17352b]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a3f] focus-visible:ring-offset-2"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-[#e8eee6] text-sm font-bold text-[#17352b]">
                    {profile.firstName ? (
                      profile.firstName.charAt(0).toUpperCase()
                    ) : (
                      <UserRound size={16} />
                    )}
                  </span>
                  <span className="max-w-24 truncate text-sm font-semibold text-[#35483e]">
                    {profile.firstName || "Profile"}
                  </span>
                </Link>
                <span className="h-6 w-px bg-[#17352b]/10" aria-hidden="true" />
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#58665e] transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  aria-current={
                    location.pathname === "/login" ? "page" : undefined
                  }
                  className="inline-flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold text-[#35483e] transition hover:bg-[#17352b]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a3f] focus-visible:ring-offset-2"
                >
                  Sign in
                </Link>
                <Link
                  to="/verifyemail"
                  aria-current={
                    location.pathname === "/verifyemail" ? "page" : undefined
                  }
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#17352b] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#244c3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a3f] focus-visible:ring-offset-2"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#17352b]/10 text-[#17352b] transition hover:bg-[#f6f7f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a3f] focus-visible:ring-offset-2 lg:hidden"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation menu"
            onClick={closeMenu}
            className="fixed inset-0 top-16 z-0 bg-[#10251f]/25 backdrop-blur-[2px] lg:hidden"
          />
          <div
            id="mobile-navigation"
            className="absolute inset-x-3 top-[calc(100%+0.5rem)] z-10 rounded-2xl border border-[#17352b]/10 bg-white p-3 shadow-[0_18px_45px_rgba(16,37,31,0.18)] lg:hidden"
          >
            <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a978e]">
              Menu
            </p>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    aria-current={item.active ? "page" : undefined}
                    onClick={closeMenu}
                    className={`flex min-h-12 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a3f] ${
                      item.active
                        ? "bg-[#edf1eb] text-[#17352b]"
                        : "text-[#58665e] hover:bg-[#f6f7f3] hover:text-[#17352b]"
                    }`}
                  >
                    {item.icon || (
                      <span
                        className={`size-1.5 rounded-full ${
                          item.active ? "bg-[#b98a3f]" : "bg-[#c4cdc5]"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-3 border-t border-[#17352b]/8 pt-3">
              {token ? (
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex min-h-12 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-[#35483e] transition hover:bg-[#f6f7f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a3f]"
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-[#e8eee6] text-[#17352b]">
                      {profile.firstName ? (
                        profile.firstName.charAt(0).toUpperCase()
                      ) : (
                        <UserRound size={16} />
                      )}
                    </span>
                    {profile.firstName || "Your profile"}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-[#58665e] transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <LogOut size={17} aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex min-h-11 items-center justify-center rounded-xl border border-[#17352b]/15 text-sm font-semibold text-[#17352b] transition hover:bg-[#f6f7f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a3f]"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/verifyemail"
                    onClick={closeMenu}
                    className="flex min-h-11 items-center justify-center rounded-xl bg-[#17352b] text-sm font-semibold text-white transition hover:bg-[#244c3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b98a3f]"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
