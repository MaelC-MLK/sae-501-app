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
import { useState, useEffect } from "react";

interface CarouselRecomProps {
  events: EventProps[];
}

export function CarouselInscris({ events }: CarouselRecomProps) {
  const [size, setSize] = useState('');
  const [eventsList, setEventsList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if(events.length == 1 ) {
      setSize('md:basis-1/1 lg:basis-1/1');
    }

    if(events.length == 2 ) {
      setSize('md:basis-1/2 lg:basis-1/2');
    }

    if(events.length >= 3 ) {
      setSize('md:basis-1/2 lg:basis-1/3');
    }

    const eventsArray = events.map((event) => (
      <CarouselItem key={event.id} className={size}>
        <CardCarouselEvent event={event} />
      </CarouselItem>
    ));

    setEventsList(eventsArray);

  }, [events, size]);

  return (
    <Carousel className="w-full max-w-7xl justify-self-center px-5 sm:px-16">
      <CarouselContent>
        {eventsList}
      </CarouselContent>
      <CarouselPrevious className="hover:scale-125 transition-transform duration-200 ml-10" />
      <CarouselNext className="hover:scale-125 transition-transform duration-200 mr-10" />
    </Carousel>
  );
}
