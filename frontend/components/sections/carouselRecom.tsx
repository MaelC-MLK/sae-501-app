import * as React from "react";
import { CardEvent } from "@/components/cards/cardEvent";
import { EventProps } from "@/types/event";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselRecomProps {
    events: EventProps[];
}

export function CarouselRecom({ events }: CarouselRecomProps) {
    const recommendedEvents = events.filter(event => event.isRecommended);


    console.log(events)
    console.log(recommendedEvents)
    return (
        <Carousel className="w-full">
            <CarouselContent className="-ml-1">
                {recommendedEvents.map((event, index) => (
                    <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                            <CardEvent event={event} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hover:scale-125 transition-transform duration-200" />
            <CarouselNext className="hover:scale-125 transition-transform duration-200" />
        </Carousel>
    );
}
