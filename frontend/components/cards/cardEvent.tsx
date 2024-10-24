import * as React from "react"

import Image from 'next/image'
import { Badge } from "@/components/ui/badge"

import { EventProps } from "@/types/event"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"



export function CardEvent({ event }: { event: EventProps }) {
    const defaultImage = "/images/event.jpg";

    return (
        <Link href={`/event/${event.id}`} passHref>
            <Card className="group overflow-hidden relative cursor-pointer shadow select-none">
                <div className="relative w-full h-64">
                    <Image
                        src={event.image ? event.image : defaultImage}
                        alt={`${event.title}-image`}
                        layout="fill"
                        objectFit="cover"
                    />
                    <div className="group absolute -bottom-28 left-0 flex flex-col text-secondary bg-black bg-opacity-70 rounded-lg w-full group-hover:-translate-y-28 transition-transform duration-300">
                        <CardHeader className="flex flex-col mb-1">
                            <div className="flex flex-row justify-between">
                                <CardTitle className="text-2xl">{event.title}</CardTitle>
                                <Badge variant="outline" className="h-fit">Public</Badge>
                            </div>
                            {event.date_start.substring(0, 10) === event.date_end.substring(0, 10) ? (
    <span className="text-sm font-normal">
        {event.date_start.substring(0, 10)} | {event.date_start.substring(13)} - {event.date_end.substring(13)}
    </span>
) : (
    <span className="text-sm font-normal">
        {event.date_start} au {event.date_end}
    </span>
)}

                        </CardHeader>
                        <CardContent className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                            <CardDescription className="line-clamp-5 h-24">{event.description}</CardDescription>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </Link>
    )
}