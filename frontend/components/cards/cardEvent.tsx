import * as React from "react";
import Image from 'next/image';
import Link from "next/link";
import { k2d } from "@/app/fonts/fonts";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { EventProps } from "@/types/event";
import { Badge } from "@/components/ui/badge"

export function CardEvent({ event }: { event: EventProps }) {
    const defaultImage = "/images/event_default.webp";
    const image = event.image ? `http://localhost:8080/uploads/events/${event.image}` : defaultImage;

    const dateStart = parse(event.date_start, "dd/MM/yyyy - HH:mm", new Date());
    const dateEnd = parse(event.date_end, "dd/MM/yyyy - HH:mm", new Date());

    const formattedDateStart = format(dateStart, "EEEE d MMMM yyyy", { locale: fr });
    const formattedDateEnd = format(dateEnd, "EEEE d MMMM yyyy", { locale: fr });
    const formattedDateStartShort = format(dateStart, "dd/MM/yyyy", { locale: fr });
    const formattedDateEndShort = format(dateEnd, "dd/MM/yyyy", { locale: fr });


    return (
        <Link href={`/event/${event.id}`} passHref className="border-2 rounded-xl overflow-hidden p-2 w-96 group bg-background relative h-fit">
            <Badge variant="secondary" className="absolute top-4 right-4 z-20 gap-1">

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>

                {<span>{event.users.length}</span>}
                </Badge>

            <div className="relative w-full h-52 rounded-xl overflow-hidden">
                <Image
                    src={image}
                    alt={`${event.title}-image`}
                    layout="fill"
                    objectFit="cover"
                    unoptimized={true}
                    className="group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            <div className="group flex flex-col mt-2">
                <p className={`${k2d.className} text-lg font-medium truncate`}>{event.title}</p>
                <div className="text-muted-foreground flex items-center gap-3">
                    {formattedDateStart === formattedDateEnd ? (
                        <>
                            <div className="flex items-center gap-1 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                </svg>
                                <span className="text-sm font-normal capitalize">
                                    {formattedDateStart}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 truncate">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <span className="text-sm font-normal capitalize truncate">
                                    {event.location}
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-1 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                </svg>
                                <span className="text-sm font-normal capitalize">
                                    {formattedDateStartShort} <span className="lowercase">au</span> {formattedDateEndShort}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 truncate">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <span className="text-sm font-normal capitalize truncate">
                                    {event.location}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}