export default function Firstpage() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] w-full flex-col overflow-hidden bg-[#17352b] lg:justify-center">
      <img
        src="/images/frontpage.png"
        alt=""
        aria-hidden="true"
        className="block max-h-[42svh] w-full bg-[#d8dc36] object-contain lg:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden bg-cover `bg-position-[58%_center] lg:block"
        style={{ backgroundImage: "url('/images/frontpage.png')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden bg-linear-to-r from-slate-950/80 via-slate-950/55 to-slate-950/10 lg:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200 sm:mb-5 sm:text-sm sm:tracking-[0.18em]">
            VisitorHub | Welcome made simple
          </p>
          <h1 className="max-w-2xl text-balance text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.08]">
            Every visit starts with a warm welcome.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:mt-6 sm:text-lg">
            Plan your visit, complete registration, and arrive ready to enjoy
            the experience.
          </p>
        </div>
      </div>
    </section>
  );
}
