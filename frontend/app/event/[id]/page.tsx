"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { EventProps } from "@/types/event";
import { Badge } from '@/components/ui/badge';
import { PopupJoinPublicEvent } from '@/components/sections/popupJoinPublicEvent';
import { PopupShareEvent } from '@/components/sections/popupShareEvent';
import { PopUpInviteEvent } from '@/components/sections/popUpInviteEvent';
import { k2d } from '@/app/fonts/fonts';
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { SkeletonEventDetails } from "@/components/skeletons/skeletons";
import { useUser } from '@/contexts/UserProvider';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast"
import { checkUserRegistration, joinEvent, unregisterEvent } from "@/lib/data";
import { fetchEventByToken } from "@/lib/data";

export default function Event() {
    const { id } = useParams() as { id: string };
    const [event, setEvent] = useState<EventProps | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { user } = useUser();
    const { toast } = useToast();
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
    const [participantCount, setParticipantCount] = useState<number>(0);

    useEffect(() => {
        const fetchEvent = async () => {
            try{
                const data = await fetchEventByToken(id);
                setEvent(data);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
          };

        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (event) {
            // Initialisez le nombre de participants
            setParticipantCount(event.users.length || 0);
        }
        if (user && event) {
            const fetchRegistrationStatus = async () => {
                try {
                    const status = await checkUserRegistration({ id: user.id }, event.id);
                    setIsRegistered(status);
                } catch (error) {
                    console.error("Failed to fetch registration status", error);
                }
            };
    
            fetchRegistrationStatus();
        }
    }, [user, event]);
    
    if (loading) {
        return (
            <SkeletonEventDetails />
        );
    }

    if (!event) {
        notFound();
    }

    const defaultImage = "/images/event_default.webp";
    const eventUrl = `${process.env.APP_BASE_URL}/event/${event.idToken}`;

    const handleJoinEvent = async () => {
        if (participantCount >= participantLimit) {
            toast({
                title: "Limite atteinte",
                description: "Le nombre maximum de participants a été atteint.",
                action: (
                    <ToastAction onClick={handleUnregisterEvent} altText="Annuler">Annuler</ToastAction>
                ),
            });
            return;
        }
    
        try {
            await joinEvent(event.id);
            setIsRegistered(true);
            setParticipantCount(prevCount => prevCount + 1);
            const description = formattedDateStart === formattedDateEnd
                ? `Le ${formattedDateStart} de ${startTime} à ${endTime}`
                : `Du ${formattedDateStart} à ${startTime} au ${formattedDateEnd} à ${endTime}`;
            toast({
                title: "Événement planifié !",
                description: description,
                action: (
                    <ToastAction onClick={handleUnregisterEvent} altText="Annuler">Annuler</ToastAction>
                ),
            });
        } catch (error) {
            toast({
                title: "Oups... Inscription impossible",
                description: "Une erreur est survenue lors de l'inscription à l'événement.",
                action: (
                    <ToastAction onClick={handleJoinEvent} altText="Réessayer">Réessayer</ToastAction>
                ),
            });
            console.log(error);
        }
    };

    const handleUnregisterEvent = async () => {
        try {
            await unregisterEvent(event.id);
            setIsRegistered(false);
            setParticipantCount(prevCount => Math.max(0, prevCount - 1));
            toast({
                title: "Désinscription réussie !",
                description: "Vous avez été désinscrit de l'événement.",
                action: (
                    <ToastAction onClick={handleJoinEvent} altText="Annuler">Annuler</ToastAction>
                ),
            });
            
        } catch (error) {
            toast({
                title: "Oups... Désinscription impossible",
                description: "Une erreur est survenue lors de la désinscription à l\'événement.",
                action: (
                    <ToastAction onClick={handleJoinEvent} altText="Réessayer">Réessayer</ToastAction>
                ),
            });
            console.log(error);
        }
    };

    const dateStart = parse(event.date_start, "dd/MM/yyyy - HH:mm", new Date());
    const dateEnd = parse(event.date_end, "dd/MM/yyyy - HH:mm", new Date());
    const formattedDateStart = format(dateStart, "EEEE d MMMM yyyy", { locale: fr });
    const formattedDateEnd = format(dateEnd, "EEEE d MMMM yyyy", { locale: fr });
    const formattedDateStartShort = format(dateStart, "dd/MM/yyyy", { locale: fr });
    const formattedDateEndShort = format(dateEnd, "dd/MM/yyyy", { locale: fr });

    const startTime = format(dateStart, "HH:mm", { locale: fr });
    const endTime = format(dateEnd, "HH:mm", { locale: fr });

    const participantLimit = event.limit;
    const participantPercentage = (participantCount / participantLimit) * 100;

    let badgeVariant: "secondary" | "default" | "destructive" | "outline" = "secondary";
    if (participantPercentage >= 75 && participantPercentage < 100) {
        badgeVariant = "default";
    } else if (participantPercentage >= 100) {
        badgeVariant = "destructive";
    }

    return (

        <div className="mt-12">
            <div className="h-80 relative">
                <Image
                    src={event.image ? `${process.env.API_BASE_URL}/uploads/events/${event.image}` : defaultImage}
                    alt={event.title}
                    unoptimized={true}
                    layout="fill"
                    objectFit="cover"
                    className="max-h-96"
                />
                {event.isVisible ? <Badge variant="secondary" className="absolute bg-foreground text-background top-5 right-5 md:hidden hover:bg-foreground">Public</Badge> : <Badge variant="secondary" className="absolute bg-foreground text-background top-5 right-5 md:hidden hover:bg-foreground">Privé</Badge>}
            </div>

            <div className="max-w-7xl w-full mt-6 px-10 justify-self-center relative">
                {event.isVisible ? <Badge variant="secondary" className="absolute bg-foreground text-background top-0 right-10 text-base hidden md:block hover:bg-foreground">Public</Badge> : <Badge variant="secondary" className="absolute bg-foreground text-background top-0 right-10 text-base hidden md:block hover:bg-foreground">Privé</Badge>}
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
                                <div className="flex items-center gap-3 mb-2">

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
                        <div className="flex items-center gap-3 mb-2">
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
                                <div className="flex items-center gap-3 mb-2">
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
                        <div className="flex items-center gap-3 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>



                            <p className={`${k2d.className} font-medium text-xl`}>
                                Participants

                            </p>
                        </div>
                        <Badge variant={badgeVariant} className={`${participantPercentage >= 75 && participantPercentage < 100 ? 'bg-warning hover:bg-warning' : null} font-normal text-base`}>
                            {participantCount} / {participantLimit}
                        </Badge>
                    </div>

                </div>


                <div className="my-10">
                    <div className="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>




                        <p className={`${k2d.className} font-medium text-xl`}>
                            Créateur

                        </p>
                    </div>
                    <div className="flex items-center gap-5 mt-2">
                        <div className="overflow-hidden">
                            <div className="w-12 h-12">

                            <Image
                                src={event.creator.avatar ? `${process.env.API_BASE_URL}/uploads/users/${event.creator.avatar}` : "/images/profile-picture.webp"}
                                alt="user-image"
                                width={40}
                                height={40}
                                quality={100}
                                unoptimized={true}
                                // objectFit="cover"
                                className="rounded-full object-cover shrink-0 w-full h-full"
                                />
                                </div>
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
                    {user && isRegistered !== null ? (
                        isRegistered ? (
                            <Button
                                variant={'outline'}
                                onClick={handleUnregisterEvent}
                            >
                                Se désinscrire
                            </Button>
                        ) : (
                            participantCount < participantLimit && (
                                <Button
                                    variant={'default'}
                                    onClick={handleJoinEvent}
                                >
                                    Ajouter au calendrier
                                </Button>
                            )
                        )
                    ) : (
                        participantCount < participantLimit && (
                            <PopupJoinPublicEvent eventId={event.id}  />
                        )
                    )}
                    <PopupShareEvent eventUrl={eventUrl} />
                    <PopUpInviteEvent eventId={event.id} eventTitle={event.title} />
                </div>

            </div>

        </div>

    );
}
