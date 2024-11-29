import * as React from "react";
import Image from 'next/image';
import Link from "next/link";
import { k2d } from "@/app/fonts/fonts";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { EventProps } from "@/types/event";
import { Badge } from "@/components/ui/badge"

export function CardDraft({ event }: { event: EventProps }) {
    const defaultImage = "/images/event_default.webp";
    const image = event.image ? `${process.env.API_BASE_URL}/uploads/events/${event.image}` : defaultImage;

    const dateStart = parse(event.date_start, "dd/MM/yyyy - HH:mm", new Date());
    const dateEnd = parse(event.date_end, "dd/MM/yyyy - HH:mm", new Date());

    const formattedDateStart = format(dateStart, "EEEE d MMMM yyyy", { locale: fr });
    const formattedDateEnd = format(dateEnd, "EEEE d MMMM yyyy", { locale: fr });
    const formattedDateStartShort = format(dateStart, "dd/MM/yyyy", { locale: fr });
    const formattedDateEndShort = format(dateEnd, "dd/MM/yyyy", { locale: fr });

    const startTime = format(dateStart, "HH:mm", { locale: fr });
    const endTime = format(dateEnd, "HH:mm", { locale: fr });

    return (
        <div className="border-2 rounded-xl overflow-hidden py-2 px-4 md:px-10 w-full group bg-background relative h-fit">

            {/* <Image
                    src={image}
                    alt={`${event.title}-image`}
                    layout="fill"
                    objectFit="cover"
                    unoptimized={true}
                    className="group-hover:scale-105 transition-transform duration-300 relative"
                /> */}

            <div className="group flex flex-col my-2">
                <p className={`${k2d.className} text-xl font-medium truncate mb-2`}>{event.title}</p>
                <div className="text-muted-foreground flex flex-wrap items-center gap-5">
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

                            <div className="flex items-center gap-1 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                <span className="text-sm font-normal capitalize">
                                    {startTime} - {endTime}
                                </span>
                            </div>                

                            {event.location ? (

                                <div className="flex items-center gap-1 truncate">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                    <span className="text-sm font-normal capitalize truncate max-w-96">
                                        {event.location}
                                    </span>
                                </div>
                            ) : null
                            }

                            

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

                            <div className="flex items-center gap-1 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                <span className="text-sm font-normal capitalize">
                                    {startTime} - {endTime}
                                </span>
                            </div>      


                            {event.location ? (

                            <div className="flex items-center gap-1 truncate">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 shrink-0">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                                <span className="text-sm font-normal capitalize truncate max-w-96">
                                    {event.location}
                                </span>
                            </div>
                            ) : null
                            }
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}