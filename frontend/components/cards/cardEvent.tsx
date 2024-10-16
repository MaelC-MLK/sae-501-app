import * as React from "react"

import Image from 'next/image'
import { Badge } from "@/components/ui/badge"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


interface EventProps {
    title: string;
    date: string;
    time: string;
    description: string;
    badge: string;
    image: string;
}


export function CardEvent({ event }: { event: EventProps }) {
    return (
        <Card className="group overflow-hidden relative cursor-pointer shadow select-none">
            <div className="relative w-full h-64">
                <Image
                    src={event.image}
                    alt={`${event.title}-image`}
                    layout="fill"
                    objectFit="cover"
                />
                <div className="group absolute -bottom-28 left-0 flex flex-col text-secondary bg-black bg-opacity-70 rounded-lg w-full group-hover:-translate-y-28 transition-transform duration-300">
                    <CardHeader className="flex flex-row justify-between">
                        <div>
                            <CardTitle className="text-2xl">{event.title}</CardTitle>
                            <span className="text-lg font-medium">{event.date}</span>
                        </div>
                        <Badge variant="outline" className="h-fit">{event.badge}</Badge>
                    </CardHeader>
                    <CardContent className="transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        <span className="text-md font-normal">{event.time}</span>
                        <CardDescription className="line-clamp-4 h-20">{event.description}</CardDescription>
                    </CardContent>
                </div>
            </div>
        </Card>
    )
}