import * as React from "react";
import { CardCarouselEvent } from "@/components/cards/cardCarouselEvent";
import { EventProps } from "@/types/event";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SkeletonCardCarousel } from "@/components/skeletons/skeletons";

interface CarouselRecomProps {
  events: EventProps[];
}

export function CarouselInscris({ events }: CarouselRecomProps) {
  console.log(events);
  const loading = events.length === 0;

  return (
    <Carousel className="w-full max-w-7xl justify-self-center px-5 sm:px-16">
      <CarouselContent>
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <SkeletonCardCarousel />
            </CarouselItem>
          ))
        ) : (
          events.map((event, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <CardCarouselEvent event={event} />
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      <CarouselPrevious className="hover:scale-125 transition-transform duration-200 ml-10" />
      <CarouselNext className="hover:scale-125 transition-transform duration-200 mr-10" />
    </Carousel>
  );
}
