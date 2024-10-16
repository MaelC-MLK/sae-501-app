import * as React from "react"
import Image from 'next/image'
import ScrollButton from "@/components/ui/scrollButton"
import { CardEvent } from "@/components/cards/cardEvent"
import { CarouselRecom } from "@/components/sections/carouselRecom"
import { SignUpCallToAction } from "@/components/sections/signUpCallToAction"

// Events factices pour tester l'interface
const events = [
  { title: "Event 1", date: "Saturday, April 6, 2025", time: "16h - 18h", description: "Join us for an information meeting dedicated to the launch of the project.", badge: "Public", image: "/images/event.jpg" },
  { title: "Event 2", date: "Sunday, April 7, 2025", time: "10h - 12h", description: "A workshop focusing on effective communication strategies within teams.", badge: "Public", image: "/images/event.jpg" },
  { title: "Event 3", date: "Monday, April 8, 2025", time: "14h - 15h", description: "An interactive session on project management techniques.", badge: "Public", image: "/images/event.jpg" },
  { title: "Event 4", date: "Tuesday, April 9, 2025", time: "18h - 20h", description: "Join us for a networking event where you can meet industry professionals.", badge: "Public", image: "/images/event.jpg" },
  { title: "Event 5", date: "Wednesday, April 10, 2025", time: "10h - 12h", description: "A seminar on digital marketing strategies for small businesses.", badge: "Public", image: "/images/event.jpg" },
  { title: "Event 6", date: "Thursday, April 11, 2025", time: "13h - 15h", description: "Explore the latest trends in technology with industry experts.", badge: "Public", image: "/images/event.jpg" },
  { title: "Event 7", date: "Friday, April 12, 2025", time: "17h - 19h", description: "Participate in a hands-on workshop focused on improving coding skills.", badge: "Public", image: "/images/event.jpg" },
  { title: "Event 8", date: "Saturday, April 13, 2025", time: "09h - 11h", description: "Attend a community service event where we will be volunteering at the local shelter.", badge: "Public", image: "/images/event.jpg" },
  { title: "Event 9", date: "Sunday, April 14, 2025", time: "15h - 17h", description: "Join us for a guided tour of the new exhibition at the city museum.", badge: "Public", image: "/images/event.jpg" },
  { title: "Event 10", date: "Monday, April 15, 2025", time: "11h - 13h", description: "Participate in a roundtable discussion on sustainability.", badge: "Public", image: "/images/event.jpg" },
];


export default function Home() {
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
        <h2 className="w-full items-start text-2xl font-bold border-b-2">Recommendations</h2>
        <CarouselRecom events={events}/>
      </div>
      <ScrollButton />
      <div id="events-list" className="flex flex-col justify-center items-center bg-background mx-4 sm:mx-20 border-2 rounded-xl p-4 gap-3 shadow my-12">
        <h2 className="w-full items-start text-2xl font-bold border-b-2">All public events coming !</h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {events.map((event, index) => (
            <CardEvent key={index} event={event} />
          ))}
        </div>
      </div>
      <SignUpCallToAction />
    </div>
  );
}
