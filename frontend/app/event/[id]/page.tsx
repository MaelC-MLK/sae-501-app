"use client";

import * as React from "react";
import { useEffect } from "react";
import Image from 'next/image';
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useEvents } from "@/components/EventContext";
import { EventProps } from "@/types/event";
import { Badge } from '@/components/ui/badge';

import { PopupJoinPublicEvent } from '@/components/sections/popupJoinPublicEvent';
import { PopupJoin } from '@/components/sections/popupJoin';
import { PopupShareEvent } from '@/components/sections/popupShareEvent';
import { k2d } from '@/app/fonts/fonts';
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { SkeletonEventDetails } from "@/components/skeletons/skeletons";
import { useUser } from '@/contexts/UserProvider';
import { Button } from "@/components/ui/button";

export default function Event() {
    const { id } = useParams();
    const events = useEvents();
    const [loading, setLoading] = React.useState(true);
    const { user } = useUser();

    useEffect(() => {
        if (events.length > 0) {
            setLoading(false);
        }
    }, [events]);

    if (loading) {
        return (
            <SkeletonEventDetails />
        );
    }

    const event = events.find((event: EventProps) => event.id === Number(id));

    const defaultImage = "/images/event_default.webp";
    const eventUrl = `http://localhost:8090/event/${event.id}`;

    const dateStart = parse(event.date_start, "dd/MM/yyyy - HH:mm", new Date());
    const dateEnd = parse(event.date_end, "dd/MM/yyyy - HH:mm", new Date());
    const formattedDateStart = format(dateStart, "EEEE d MMMM yyyy", { locale: fr });
    const formattedDateEnd = format(dateEnd, "EEEE d MMMM yyyy", { locale: fr });
    const formattedDateStartShort = format(dateStart, "dd/MM/yyyy", { locale: fr });
    const formattedDateEndShort = format(dateEnd, "dd/MM/yyyy", { locale: fr });

    const startTime = format(dateStart, "HH:mm", { locale: fr });
    const endTime = format(dateEnd, "HH:mm", { locale: fr });

    if (!event) {
        notFound();
    }

    return (

        <div className="mt-12">
            <div className="h-80 relative">
                <Image
                    src={event.image ? `http://localhost:8080/uploads/events/${event.image}` : defaultImage}
                    alt={event.title}
                    unoptimized={true}
                    layout="fill"
                    objectFit="cover"
                    className="max-h-96"
                />
                <Badge variant="secondary" className="absolute bg-foreground text-background top-5 right-5 md:hidden">Public</Badge>
            </div>

            <div className="max-w-7xl w-full mt-6 px-10 justify-self-center relative">
                <Badge variant="secondary" className="absolute bg-foreground text-background top-0 right-10 text-base hidden md:block">Public</Badge>
                {<h2 className={`${k2d.className} font-medium text-2xl md:w-10/12 lg:w-11/12`}>{event.title}</h2>}

                {event.description ? (
                    <>
                        <h3 className={`${k2d.className} font-medium text-xl mt-5 mb-3`}>À propos de l’événement</h3>
                        <p>{event.description}</p>
                    </>
                ) : null}


                <div className="flex flex-wrap gap-10 mt-10">
                    <div>
                        {formattedDateStart === formattedDateEnd ? (
                            <>
                                <div className="flex items-center gap-3">

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                    </svg>
                                    <p className={`${k2d.className} font-medium text-xl`}>
                                        Date

                                    </p>
                                </div>
                                <span className="font-normal capitalize">
                                    {formattedDateStart}
                                </span>
                            </>
                        )
                            : (
                                <>
                                    <div className="flex items-center gap-3 mb-1">

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                        </svg>
                                        <p className={`${k2d.className} font-medium text-xl`}>
                                            Dates

                                        </p>
                                    </div>
                                    <span className="font-normal capitalize">
                                        {formattedDateStartShort} <span className="lowercase">au</span> {formattedDateEndShort}
                                    </span>
                                </>
                            )
                        }

                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>

                            <p className={`${k2d.className} font-medium text-xl`}>
                                Heure

                            </p>
                        </div>
                        <span className="font-normal">
                            {startTime} - {endTime}
                        </span>
                    </div>

                    {event.location ? (
                        <>
                            <div>
                                <div className="flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>


                                    <p className={`${k2d.className} font-medium text-xl`}>
                                        Localisation

                                    </p>
                                </div>
                                <span className="font-normal">
                                    {event.location}
                                </span>
                            </div>
                        </>
                    ) : null
                    }

                    <div>
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>



                            <p className={`${k2d.className} font-medium text-xl`}>
                                Participants

                            </p>
                        </div>
                        <Badge variant="secondary" className="font-normal text-base">
                            {event.users.length}
                        </Badge>
                    </div>

                </div>


                <div className="my-10">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>




                        <p className={`${k2d.className} font-medium text-xl`}>
                            Créateur

                        </p>
                    </div>
                    <div className="flex items-center gap-5 mt-2">
                        <div>
                            <Image
                                src={event.creator.avatar ? `http://localhost:8080/uploads/users/${event.creator.avatar}` : "/images/profile-picture.webp"}
                                alt="user-image"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="capitalize">{event.creator.firstName} <span className="uppercase">{event.creator.lastName}</span>
                            </span>
                            <span className="opacity-40 text-sm">
                                {event.creator.email}
                            </span>


                        </div>
                    </div>
                </div>

                <div className="mb-16 flex space-x-3">
                    {user ? <Button variant={'default'} size={'lg'}>S'inscrire</Button> : <PopupJoinPublicEvent eventId={event.id} />}
                    <PopupShareEvent eventUrl={eventUrl} />
                </div>

            </div>

        </div>

    );
}
