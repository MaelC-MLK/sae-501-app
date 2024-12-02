"use client";

import * as React from "react"
import { useEffect, useState } from "react";
import Image from 'next/image'
import ScrollButton from "@/components/ui/scrollButton"
import { CarouselRecom } from "@/components/sections/carouselRecom"
import { SignUpCallToAction } from "@/components/sections/signUpCallToAction"
import { PaginatedEvents } from "@/components/sections/paginatedEvents"
import { Button } from "@/components/ui/button"
import { k2d } from "@/app/fonts/fonts"
import Link from 'next/link'
import { useUser } from '@/contexts/UserProvider'


export default function Home() {
  const [events, setEvents] = useState([]);
  const { user, setUser } = useUser();


  useEffect(() => {
    fetch(`${process.env.API_BASE_URL}/api/events/public`)
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error("Erreur lors de la récupération des événements :", error));
  }, []);

  return (
    <div className="mt-10 relative overflow-hidden">
      <div className="w-144 h-144 bg-primary rounded-full blur-6xl absolute -right-52 -top-64 -z-10" />

      <div className="hidden md:flex items-center max-w-7xl justify-evenly w-full place-self-center mt-20">
        <div>
          <h2 className={`${k2d.className} text-4xl mb-5 lg:text-5xl`}>
            Votre gestionnaire<br />
            d’événements
          </h2>
          <Link href="#events-list">
          <Button>Voir les événements</Button>
          </Link>
        </div>
        <div className="relative rounded-2xl overflow-hidden before:w-full before:h-full before:bg-black before:absolute before:opacity-15">
          <Image
          alt="Image d'illustration"
          src="/images/image_illustration_small.webp"
          width={500}
          height={500}
          className="w-96 lg:w-128"
          >
          </Image>
        </div>
      </div>

      <div className="md:hidden items-center max-w-7xl w-full place-self-center relative text-center">
        <div className="relative z-20 py-20">
          <h2 className={`${k2d.className} text-3xl text-primary-foreground mb-6 md:text-5xl`}>
            Votre gestionnaire<br />
            d’événements
          </h2>
          <Link href="#events-list">
            <Button>Voir les événements</Button>
          </Link>
        </div>
        <div className="absolute inset-0 overflow-hidden before:w-full before:h-full before:bg-black before:absolute before:opacity-60 before:z-10 before:left-0 before:right-0">
          <Image
            alt="Image d'illustration"
            src="/images/image_illustration.webp"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>

        <h2 className="font-bold max-w-7xl justify-self-center mt-7 w-full px-5 md:px-10 text-xl md:text-2xl md:mt-20 mb-5">Nos recommandations !</h2>
        <CarouselRecom events={events}/> 

      {!user && <SignUpCallToAction />}

      <PaginatedEvents events={events} />
    </div>
  );
}


{/* <div className="flex items-center max-w-7xl justify-evenly w-full place-self-center mt-20">
<div>
  <h2 className={`${k2d.className} text-5xl mb-5`}>
    Votre gestionnaire<br />
    d’événements
  </h2>
  <Link href="#events-list">
  <Button>Voir les événements</Button>
  </Link>
</div>
<div className="relative rounded-2xl overflow-hidden before:w-full before:h-full before:bg-black before:absolute before:opacity-15">
  <Image
  alt="Image d'illustration"
  src="/images/image_illustration.webp"
  width={500}
  height={500}
  >
  </Image>
</div>
</div> */}