"use client";

import * as React from "react";
import { useEffect } from "react";
import Image from 'next/image';
import CardEventDetail from "@/components/cards/cardEventDetail";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useEvents } from "@/components/EventContext";
import { EventProps } from "@/types/event";


export default function Event() {
    const { id } = useParams();
    const events = useEvents(); 
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (events.length > 0) {
            setLoading(false);
        }
    }, [events]);

    if (loading) {
        return <div>Chargement des données de l'événement...</div>;
    }

    const event = events.find((event: EventProps) => event.id === Number(id));


    if (!event) {
        notFound();
    }

    return (
        <div>
            <div className='w-full h-80 absolute'>
                <Image
                    src="/images/homepage-background.jpg"
                    alt="homepage-image"
                    layout="fill"
                    objectFit="cover"
                />
                <div className="absolute inset-0 bg-primary opacity-40"></div>
            </div>
            <div className='relative flex flex-col justify-center items-center bg-background top-44 mx-4 sm:mx-20 border-2 rounded-xl p-4 gap-3 shadow'>
                <CardEventDetail event={event} />
            </div>
        </div>
    );
}
