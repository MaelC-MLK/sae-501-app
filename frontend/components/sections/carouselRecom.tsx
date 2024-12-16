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

export function CarouselRecom({ events }: CarouselRecomProps) {
    const recommendedEvents = events.filter(event => event.isRecommended);
    const loading = events.length === 0;

    return (
        <Carousel className="w-full max-w-7xl justify-self-center px-5 sm:px-16">
            <CarouselContent className="">
            {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <SkeletonCardCarousel />
                        </CarouselItem>
                    ))
                ) : recommendedEvents.length === 0 ? (
                    <div className="text-center w-full py-10">
                        Aucun événement recommandé
                    </div>
                ) : (
                    recommendedEvents.map((event, index) => (
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