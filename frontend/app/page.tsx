import * as React from "react"
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



export default function Home() {
  return (
    <div className='relative'>
      <div className='w-full h-96'>
        <Image
          src="/images/homepage-background.jpg"
          alt="homepage-image"
          fill={true}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-primary opacity-40"></div>
      </div>
      <div className='relative flex flex-col justify-center items-center bg-background -top-16 mx-20 border-2 rounded-xl p-4 gap-4'>
        <h2 className="w-full items-start text-2xl font-bold">Recommandations</h2>

        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden relative cursor-pointer">
                    <div className="relative w-full h-64">
                      <Image
                        src="/images/event.jpg"
                        alt="event-image"
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className="group absolute -bottom-28 left-0 flex flex-col text-secondary bg-black bg-opacity-70 rounded-lg w-full hover:-translate-y-28 transition-transform duration-300">
                        <CardHeader>
                          <CardTitle className="text-2xl">Event {index + 1}</CardTitle>
                          <span className="text-lg font-medium">Saturday, april 6 2025</span>
                        </CardHeader>
                        <CardContent className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                          <span className="text-md font-normal">16h - 18h</span>
                          <CardDescription className="line-clamp-4">Join us for an information meeting dedicated to the launch of the project. This session will provide an opportunity to discover the objectives, milestones and resources in place to bring this project to fruition. We'll discuss everyone's roles and the next steps to be taken to ensure the success of this initiative.</CardDescription>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </div>
    </div>
  );
}
