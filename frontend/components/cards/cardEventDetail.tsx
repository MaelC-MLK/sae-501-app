import React from 'react';
import Image from 'next/image';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

import { EventProps } from "@/types/event";
import Link from 'next/link';


interface CardEventDetailProps {
    event: EventProps;
}

export function CardEventDetail({ event }: CardEventDetailProps) {
    const defaultImage = "/images/event.jpg";

    return (
        <div className="w-full flex flex-col md:flex-row justify-between overflow-hidden">
            <div className="pb-6 md:p-6 flex flex-col gap-4 justify-between w-full md:w-2/3">
                <div className='flex flex-row border-b-2'>
                    <h2 className="w-full items-start text-2xl font-bold">{event.title}</h2>
                    <Badge variant="default" className="h-fit">Public</Badge>
                </div>
                <div>
                    <p className="text-md font-semibold mb-1">{event.date_start} - {event.date_end}</p>
                    <div className="text-sm text-gray-600 mb-4">{event.date_start} - {event.date_end}</div>
                    <p className="mt-4 text-sm text-gray-700">{event.description}</p>
                </div>
                <div className="mt-4 flex space-x-3">
                    <Button variant={'default'} size={'lg'} className='w-full sm:w-auto'>
                        <Link href="/register">
                            S'inscrire
                        </Link>
                    </Button>
                    <Link href="/register">
                        <Button variant={'outline'} size={'lg'} className="p-2 w-auto h-auto">
                            <Image
                                src="/images/Share.svg"
                                alt="share"
                                width={24}
                                height={24}
                            />
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                <Image
                    src={event.image ? event.image : defaultImage}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                />
            </div>
        </div>
    );
};

export default CardEventDetail;
