import { ArrowUpRight, Mail, MapPin, ShieldCheck } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#10251f] text-[#c4d1c9]">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#80a889]/15 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[#d6a85f]/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-7 pt-12 sm:px-8 sm:pt-16 lg:px-10">
        <div className="mb-12">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[#d6a85f]">
                <MapPin size={18} />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Find Us
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Visit Our Office
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Privilon, 312, Sarkhej - Gandhinagar Highway, Vikram Nagar,
                Ahmedabad, Gujarat 380058.
              </p>
            </div>

            {/* <a
              href="https://www.google.com/maps/search/?api=1&query=Privilon%2C%20312%2C%20Sarkhej%20-%20Gandhinagar%20Highway%2C%20Vikram%20Nagar%2C%20Ahmedabad%2C%20Gujarat%20380058"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-[#f0c879] transition hover:border-[#d6a85f] hover:bg-white/5"
            >
              Get Directions
              <ArrowUpRight size={16} />
            </a> */}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-xl shadow-black/20">
            <iframe
              title="VisitorHub office location in Ahmedabad"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29375.101539946136!2d72.48490848384719!3d23.02789546312918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b390a555555%3A0xcbbfef21de2b5a37!2sPrivilon%2C%20312%2C%20Sarkhej%20-%20Gandhinagar%20Hwy%2C%20Vikram%20Nagar%2C%20Ahmedabad%2C%20Gujarat%20380058!5e0!3m2!1sen!2sin!4v1792565578425!5m2!1sen!2sin"
              className="h-64 w-full rounded-xl border-0 sm:h-80 lg:h-96"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>

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
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-[#d6a85f] hover:bg-[#d6a85f]/10 hover:text-[#f0c879]"
              >
                <FaLinkedin size={16} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 transition hover:border-[#d6a85f] hover:bg-[#d6a85f]/10 hover:text-[#f0c879]"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
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
                  Privilon, Vikram Nagar
                  <br />
                  Ahmedabad, Gujarat 380058
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
            <Link to="/privacy" className="transition hover:text-slate-300">
              Privacy
            </Link>

            <Link to="/terms" className="transition hover:text-slate-300">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
