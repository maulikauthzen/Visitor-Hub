import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, Pause, Play, Sparkles } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const slides = [
  {
    image: "/images/garba.avif",
    alt: "A colorful Garba celebration",
    label: "Culture & community",
    title: "Celebrate the moments that bring us together.",
  },
  {
    image: "/images/techevent.jpg",
    alt: "A technology event",
    label: "Ideas & innovation",
    title: "Discover ideas shaping what comes next.",
  },
  {
    image: "/images/justin-bieber.jpg",
    alt: "A live music event",
    label: "Music & live events",
    title: "Make room for an unforgettable experience.",
  },
  {
    image: "/images/donald-trump-vladimir-putin.jpg",
    alt: "A speaker at an event",
    label: "People & perspectives",
    title: "Be part of conversations that matter.",
  },
  {
    image: "/images/globalevent.avif",
    alt: "A global community event",
    label: "Events for everyone",
    title: "Find your people. Find your next event.",
  },
];

export default function CarouselPlugin() {
  const [api, setApi] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const plugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  React.useEffect(() => {
    if (!api) return;

    const updateSelectedIndex = () =>
      setSelectedIndex(api.selectedScrollSnap());
    updateSelectedIndex();
    api.on("select", updateSelectedIndex);
    api.on("reInit", updateSelectedIndex);

    return () => {
      api.off("select", updateSelectedIndex);
      api.off("reInit", updateSelectedIndex);
    };
  }, [api]);

  const toggleAutoplay = () => {
    if (isPlaying) {
      plugin.current.stop();
    } else {
      plugin.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="bg-[#f5f7f2] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#47735b] sm:text-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Moments worth showing up for
            </p>
            <h2 className="max-w-2xl text-balance text-3xl font-bold leading-tight tracking-tight text-[#14251f] sm:text-4xl lg:text-5xl">
              Find an experience that feels like yours.
            </h2>
          </div>
          
        </div>

        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{ loop: true }}
          aria-label="Featured events"
          className="group relative w-full"
        >
          <CarouselContent className="ml-0">
            {slides.map((slide, index) => (
              <CarouselItem key={slide.image} className="basis-full pl-0">
                <article className="relative isolate h-100 w-full overflow-hidden rounded-2xl bg-[#173d32] shadow-[0_18px_50px_rgba(20,37,31,0.16)] sm:h-125 lg:h-150 sm:rounded-3xl">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div
                    className="absolute inset-0 -z-10 bg-linear-to-t from-[#071a14]/90 via-[#071a14]/35 to-black/5"
                    aria-hidden="true"
                  />

                  <div className="flex h-full flex-col justify-end p-5 text-white sm:p-8 md:p-12 lg:p-14">
                    <span className="mb-3 w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md sm:mb-4 sm:px-4 sm:text-xs">
                      {slide.label}
                    </span>
                    <h3 className="max-w-3xl text-balance text-2xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                      {slide.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:mt-4 sm:text-base sm:leading-7">
                      VisitorHub makes it easier to plan ahead and arrive ready
                      to enjoy the experience.
                    </p>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* <button
            type="button"
            onClick={() => api?.scrollPrev()}
            aria-label="Show previous slide"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#173d32] sm:left-5 sm:h-12 sm:w-12"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            aria-label="Show next slide"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#173d32] sm:right-5 sm:h-12 sm:w-12"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button> */}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1 sm:mt-5">
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Choose a slide"
            >
              {slides.map((slide, index) => (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}: ${slide.label}`}
                  aria-current={selectedIndex === index ? "true" : undefined}
                  className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#47735b] focus-visible:ring-offset-2 ${
                    selectedIndex === index
                      ? "w-8 bg-[#173d32]"
                      : "w-2.5 bg-[#b8c7bc] hover:bg-[#78917f]"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium tabular-nums text-[#64736a]">
                {String(selectedIndex + 1).padStart(2, "0")}{" "}
                <span aria-hidden="true">/</span>{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleAutoplay}
              aria-label={
                isPlaying ? "Pause automatic slides" : "Play automatic slides"
              }
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#dce4dc] bg-white px-3.5 text-sm font-semibold text-[#294c3b] shadow-sm transition hover:border-[#a8bcad] hover:bg-[#fbfcfa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#47735b] focus-visible:ring-offset-2"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4" aria-hidden="true" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
