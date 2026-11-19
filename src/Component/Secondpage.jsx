import { API_URL } from "../lib/api";
import * as React from "react";
import {
  ArrowRight,
  Clock3,
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import axios from "axios";

export default function Secondpage() {
  const [data, setData] = React.useState([]);
  const [eventsLoaded, setEventsLoaded] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const eventsPerPage = 3;
  const requestedPage = Math.max(
    1,
    Number.parseInt(searchParams.get("page"), 10) || 1,
  );

  React.useEffect(() => {
    getevents();
  }, []);

  function getevents() {
    axios
      .get(`${API_URL}/events`)
      .then((res) => {
        setData(res.data);
        setEventsLoaded(true);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
      });
  }

  const totalPages = Math.max(1, Math.ceil(data.length / eventsPerPage));
  const currentPage = Math.min(requestedPage, totalPages);

  const startIndex = (currentPage - 1) * eventsPerPage;

  const currentEvents = data.slice(startIndex, startIndex + eventsPerPage);

  React.useEffect(() => {
    if (eventsLoaded && requestedPage !== currentPage) {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (currentPage === 1) next.delete("page");
          else next.set("page", String(currentPage));
          return next;
        },
        { replace: true },
      );
    }
  }, [currentPage, eventsLoaded, requestedPage, setSearchParams]);

  function setPage(page) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (page === 1) next.delete("page");
        else next.set("page", String(page));
        return next;
      },
      { preventScrollReset: true },
    );
  }

  function nextPage() {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  }

  return (
    <section
      id="events"
      className="relative scroll-mt-16 overflow-hidden bg-[#f4f6ef] px-4 py-16 text-[#14251f] sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="pointer-events-none absolute -left-28 top-24 h-72 w-72 rounded-full bg-[#d8e7d8] blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#e9ddc9] blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#47735b]">
              <Compass className="h-4 w-4" aria-hidden="true" />
              Plan your next visit
            </div>

            <h2 className="max-w-2xl text-4xl font-bold tracking-[-0.04em] text-[#14251f] sm:text-5xl lg:text-6xl">
              Go somewhere that stays with you.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#5d6b64] sm:text-lg">
              Discover upcoming events, choose your pass, and make your next
              visit worth remembering.
            </p>
          </div>
        </div>

        <div className="mb-14 grid grid-cols-2 gap-x-3 gap-y-7 border-y border-[#d5ddd1] py-7 sm:grid-cols-4 sm:gap-3">
          <div className="border-l border-[#cbd8c8] px-3 py-1 sm:px-5">
            <MapPin
              className="mb-3 h-5 w-5 text-[#47735b]"
              aria-hidden="true"
            />

            <p className="text-sm font-bold text-[#14251f] sm:text-base">
              Great locations
            </p>

            <p className="mt-1 text-xs text-[#748078] sm:text-sm">
              Easy to reach
            </p>
          </div>

          <div className="border-l border-[#cbd8c8] px-3 py-1 sm:px-5">
            <ShieldCheck
              className="mb-3 h-5 w-5 text-[#47735b]"
              aria-hidden="true"
            />

            <p className="text-sm font-bold text-[#14251f] sm:text-base">
              Trusted events
            </p>

            <p className="mt-1 text-xs text-[#748078] sm:text-sm">
              Worth your time
            </p>
          </div>

          <div className="border-l border-[#cbd8c8] px-3 py-1 sm:px-5">
            <Clock3
              className="mb-3 h-5 w-5 text-[#47735b]"
              aria-hidden="true"
            />

            <p className="text-sm font-bold text-[#14251f] sm:text-base">
              Flexible plans
            </p>

            <p className="mt-1 text-xs text-[#748078] sm:text-sm">
              Plan at your pace
            </p>
          </div>

          <div className="border-l border-[#cbd8c8] px-3 py-1 sm:px-5">
            <Ticket
              className="mb-3 h-5 w-5 text-[#47735b]"
              aria-hidden="true"
            />

            <p className="text-sm font-bold text-[#14251f] sm:text-base">
              Easy passes
            </p>

            <p className="mt-1 text-xs text-[#748078] sm:text-sm">
              Choose your ticket
            </p>
          </div>
        </div>

        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#47735b]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Featured events
            </p>

            <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#14251f] sm:text-3xl">
              Events to put on your list
            </h3>
          </div>

          <span className="hidden text-sm font-medium text-[#748078] sm:block">
            {data.length} events available
          </span>
        </div>

        <Carousel
          opts={{
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            <CarouselItem className="basis-full">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {currentEvents.map((event) => (
                  <article
                    className="group flex h-full min-h-136 flex-col overflow-hidden rounded-[1.25rem] border border-[#e0e5dc] bg-white shadow-[0_12px_30px_rgba(35,57,45,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(35,57,45,0.13)]"
                    key={event.id}
                  >
                    <div className="relative flex min-h-52 flex-col justify-between overflow-hidden bg-[#173d32] px-6 py-7">
                      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                      <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/5" />

                      <div className="relative">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                            {event.isActive ? "Active Event" : "Inactive"}
                          </span>

                          <Sparkles
                            className="h-5 w-5 text-white/80"
                            aria-hidden="true"
                          />
                        </div>

                        <h4 className="line-clamp-2 min-h-16 text-2xl font-bold tracking-tight text-white">
                          {event.name}
                        </h4>

                        <div className="mt-3 flex min-w-0 items-center gap-2 text-sm text-white/80">
                          <MapPin className="h-4 w-4 shrink-0" />

                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="line-clamp-3 min-h-18 text-sm leading-6 text-[#65736b]">
                        {event.description}
                      </p>

                      <div className="mt-auto rounded-xl bg-[#f4f6ef] p-4">
                        <div className="flex items-center gap-3">
                          <Clock3 className="h-5 w-5 text-[#47735b]" />

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-[#748078]">
                              Event Date
                            </p>

                            <p className="mt-1 text-sm font-bold text-[#14251f]">
                              {new Date(event.startDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}{" "}
                              -&nbsp;
                              {new Date(event.endDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        <p className="mt-2 ms-8 text-xs text-[#748078]">
                          {new Date(event.startDate).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}

                          {" - "}

                          {new Date(event.endDate).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <Link
                        to={`/regstrationform/${event.id}`}
                        className="group mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#47735b] transition hover:text-[#14251f]"
                      >
                        Registration Form
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </CarouselItem>
          </CarouselContent>

          {totalPages > 1 && (
            <nav
              aria-label="Event list pagination"
              className="mx-auto mt-7 flex w-full max-w-sm items-center justify-between gap-2"
            >
              <button
                type="button"
                onClick={previousPage}
                disabled={currentPage === 1}
                className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full border border-[#cbd8c8] bg-white px-3 text-sm font-bold text-[#274d3d] transition hover:bg-[#e9f0e7] disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <span className="whitespace-nowrap px-1 text-sm font-medium text-[#748078]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full border border-[#cbd8c8] bg-white px-3 text-sm font-bold text-[#274d3d] transition hover:bg-[#e9f0e7] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </nav>
          )}
        </Carousel>
      </div>
    </section>
  );
}
