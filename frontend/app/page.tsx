"use client";

import * as React from "react"
import { useEffect, useState } from "react";
import Image from 'next/image'
import ScrollButton from "@/components/ui/scrollButton"
import { CarouselRecom } from "@/components/sections/carouselRecom"
import { SignUpCallToAction } from "@/components/sections/signUpCallToAction"
import { PaginatedEvents } from "@/components/sections/paginatedEvents"


export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/events/public')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error("Erreur lors de la récupération des événements :", error));
  }, []);

  return (
    <div className="mt-10">
      <div className='w-full h-80 absolute '>
        <Image
          src="/images/homepage-background.jpg"
          alt="homepage-image"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-primary opacity-40"></div>
      </div>
      <div className='relative flex flex-col justify-center items-center bg-background top-44 mx-4 sm:mx-20 border-2 rounded-xl p-4 gap-3 shadow'>
        <h2 className="w-full items-start text-2xl font-bold border-b-2">Nos recommandations !</h2>
        <CarouselRecom events={events}/>
      </div>
      <ScrollButton />
      <PaginatedEvents events={events} />
      <SignUpCallToAction />
    </div>
  );
}
