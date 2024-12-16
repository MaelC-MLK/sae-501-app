import React, { useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { EventProps } from "@/types/event";
import { PopupJoinPublicEvent } from '../sections/popupJoinPublicEvent';
import { PopupShareEvent } from '../sections/popupShareEvent';
import { PopupJoinPrivateEvent } from '../sections/popupJoinPrivateEvent';

interface CardEventDetailProps {
    event: EventProps;
}

export function CardEventDetail({ event }: CardEventDetailProps) {
    const defaultImage = "/images/event.jpg";
    const eventUrl = `${process.env.APP_BASE_URL}/event/${event.idToken}`;
    return (
        <div className="w-full flex flex-col md:flex-row justify-between overflow-hidden">
            <div className="pb-6 md:p-6 flex flex-col gap-4 justify-between w-full md:w-2/3">
                <div className='flex flex-row border-b-2'>
                    <h2 className="w-full items-start text-2xl font-bold">{event.title}</h2>
                    {event.isVisible ? <Badge variant="default" className="h-fit">Public</Badge> : <Badge variant="secondary" className="h-fit">Privé</Badge>}
                </div>
                <div>
                    {event.date_start.substring(0, 10) === event.date_end.substring(0, 10) ? (
                        <span className="text-md font-medium">
                            {event.date_start.substring(0, 10)} | {event.date_start.substring(13)} - {event.date_end.substring(13)}
                        </span>
                    ) : (
                        <span className="text-md font-medium">
                            {event.date_start} au {event.date_end}
                        </span>
                    )}
                    <p className='mt-2 font-semibold text-gray-700'>{event.location}</p>
                    <p className="mt-4 text-sm text-gray-700">{event.description}</p>
                </div>
                <div className="mt-4 flex space-x-3">
                    {event.isVisible ? <PopupJoinPublicEvent eventId={event.id}/> : <PopupJoinPrivateEvent />}
                    <PopupShareEvent eventUrl={eventUrl} />
                </div>
            </div>
            <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                <Image
                    src={event.image ? `${process.env.API_BASE_URL}/uploads/events/${event.image}` : defaultImage}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                    unoptimized={true}
                />
            </div>
        </div>
    );
};

export default CardEventDetail;
function setError(arg0: string) {
    throw new Error('Function not implemented.');
}

function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}

