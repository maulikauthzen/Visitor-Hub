import { ArrowUpRight, Mail, MapPin, ShieldCheck } from "lucide-react";

import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#10251f] text-[#c4d1c9]">
      <div
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#80a889]/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[#d6a85f]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-7 pt-12 sm:px-8 sm:pt-16 lg:px-10">
        <div className="grid gap-10 border-b border-white/10 pb-11 lg:grid-cols-[1.3fr_1fr_1fr_1.35fr] lg:gap-12">
          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-white"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d6a85f] text-sm text-[#17352b] shadow-lg shadow-black/20">
                V
              </span>
              Visitor<span className="text-[#d6a85f]">Hub</span>
            </Link>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Make every arrival feel simple, secure, and genuinely welcoming.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#linkedin"
                aria-label="VisitorHub on LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-[#d6a85f] hover:bg-[#d6a85f]/10 hover:text-[#f0c879]"
              >
                <FaLinkedin size={16} />
              </a>

              <a
                href="#instagram"
                aria-label="VisitorHub on Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-[#d6a85f] hover:bg-[#d6a85f]/10 hover:text-[#f0c879]"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="#facebook"
                aria-label="VisitorHub on Facebook"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-[#d6a85f] hover:bg-[#d6a85f]/10 hover:text-[#f0c879]"
              >
                <FaFacebook size={16} />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Explore
            </h2>

            <nav
              className="mt-5 flex flex-col items-start gap-3 text-sm"
              aria-label="Explore links"
            >
              <Link to="/" className="transition hover:text-[#f0c879]">
                Home
              </Link>

              <Link
                to="/verifyemail"
                className="transition hover:text-[#f0c879]"
              >
                Register as a visitor
              </Link>

              <Link to="/login" className="transition hover:text-[#f0c879]">
                Sign in
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Support
            </h2>

            <div className="mt-5 flex flex-col gap-4 text-sm">
              <a
                href="mailto:hello@visitorhub.com"
                className="group flex items-start gap-3 transition hover:text-[#f0c879]"
              >
                <Mail size={17} className="mt-0.5 shrink-0 text-[#d6a85f]" />

                <span>hello@visitorhub.com</span>
              </a>

              <div className="flex items-start gap-3 text-slate-400">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[#d6a85f]" />

                <span>
                  Built for modern workplaces
                  <br />
                  everywhere
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck size={18} className="text-[#f0c879]" />

              <h2 className="text-sm font-semibold">Stay in the loop</h2>
            </div>

            <p className="mt-2 text-sm leading-5 text-slate-400">
              Get practical updates about safer, smoother visits.
            </p>

            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>

              <input
                id="footer-email"
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0b1d18] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#d6a85f] focus:ring-2 focus:ring-[#d6a85f]/20"
              />

              <button
                type="submit"
                aria-label="Subscribe to the newsletter"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#d6a85f] text-[#17352b] transition hover:bg-[#f0c879] focus:outline-none focus:ring-2 focus:ring-[#f0c879] focus:ring-offset-2 focus:ring-offset-[#10251f]"
              >
                <ArrowUpRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VisitorHub. All rights reserved.</p>

          <div className="flex gap-5">
            <a href="#privacy" className="transition hover:text-slate-300">
              Privacy
            </a>

            <a href="#terms" className="transition hover:text-slate-300">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
