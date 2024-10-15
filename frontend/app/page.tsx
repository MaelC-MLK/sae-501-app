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
      </div>
      <div className='relative flex flex-col justify-center items-center bg-background -top-16 mx-20 border-2 rounded-md'>
        <h2>Recomandations</h2>
        <Carousel className="w-full max-w-6xl">
          <CarouselContent className="-ml-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardHeader></CardHeader>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-2xl font-semibold">{index + 1}</span>
                    </CardContent>
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
