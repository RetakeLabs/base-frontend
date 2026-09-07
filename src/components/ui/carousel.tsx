"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
  src: string;
  alt: string;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  className?: string;
}

export function Carousel({ slides, className }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-hidden rounded-lg border border-border" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.src} className="relative min-w-0 flex-[0_0_100%]">
              {/* eslint-disable-next-line @next/next/no-img-element -- generic component, arbitrary external image URLs */}
              <img
                src={slide.src}
                alt={slide.alt}
                className="aspect-video w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Slide anterior"
        className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-card/80 p-2 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-card"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        aria-label="Próximo slide"
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-card/80 p-2 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-card"
      >
        <ChevronRight className="size-4" />
      </button>

      <div className="mt-3 flex items-center justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Ir para o slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={cn(
              "size-2 rounded-full transition-colors",
              index === selectedIndex ? "bg-primary" : "bg-muted hover:bg-muted-foreground/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
