import * as React from "react";
import Image from 'next/image';
import Link from "next/link";
import { k2d } from "@/app/fonts/fonts";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { EventProps } from "@/types/event";

export function CardEvent({ event }: { event: EventProps }) {
    const defaultImage = "/images/event_default.webp";
    const image = event.image ? `http://localhost:8080/uploads/events/${event.image}` : defaultImage;

    const dateStart = parse(event.date_start, "dd/MM/yyyy - HH:mm", new Date());
    const dateEnd = parse(event.date_end, "dd/MM/yyyy - HH:mm", new Date());

    const formattedDateStart = format(dateStart, "EEEE d MMMM yyyy", { locale: fr });
    const formattedDateEnd = format(dateEnd, "EEEE d MMMM yyyy", { locale: fr });

    return (
        <Link href={`/event/${event.id}`} passHref className="border-2 rounded-xl overflow-hidden p-2">
            <div className="relative w-full h-52 rounded-xl overflow-hidden">
                <Image
                    src={image}
                    alt={`${event.title}-image`}
                    layout="fill"
                    objectFit="cover"
                    unoptimized={true}
                />
            </div>

            <div className="group flex flex-col mt-2">
                <p className={`${k2d.className} text-lg font-medium truncate`}>{event.title}</p>
                <div className="text-muted-foreground">
                    {formattedDateStart === formattedDateEnd ? (
                        <>
                        <div className="flex items-center gap-1">

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                            </svg>
                            <span className="text-sm font-normal capitalize">
                                {formattedDateStart}
                            </span>
                        </div>
                        </>
                    ) : (
                        <>
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                            </svg>
                            <span className="text-sm font-normal capitalize">
                                {formattedDateStart} au {formattedDateEnd}
                            </span>
                        </div>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}