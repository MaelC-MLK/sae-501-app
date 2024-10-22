"use client"

import * as React from "react";
import { useEffect, useState } from "react";
import Image from 'next/image';
import CardEventDetail from "@/components/cards/cardEventDetail";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation"; // Importez useParams

// Events factices pour tester l'interface
const events = [
    { id: "1", title: "Event 1", date_start: "03/11/2025", date_end: "03/11/2025", time_start: "16:00", time_end: "16:00", description: "Join us for an information meeting dedicated to the launch of the project." },
];

export default function Event() {
    const { id } = useParams();
    const event = events.find(event => event.id === id);

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
