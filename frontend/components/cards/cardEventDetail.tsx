import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

import { EventProps } from "@/types/event";


interface CardEventDetailProps {
    event: EventProps;
}

export function CardEventDetail({ event }: CardEventDetailProps) {
    return (
        <div className="w-full flex flex-col md:flex-row justify-between overflow-hidden">
            <div className="pb-6 sm:p-6 flex flex-col gap-4 justify-between w-full md:w-2/3">
                <div className='flex flex-row border-b-2'>
                    <h2 className="w-full items-start text-2xl font-bold">{event.title}</h2>
                    <Badge variant="default" className="h-fit">{event.badge}</Badge>
                </div>
                <div>
                    <p className="text-md font-semibold mb-1">{event.date}</p>
                    <div className="text-sm text-gray-600 mb-4">{event.time}</div>
                    <p className="text-sm font-medium text-gray-700">Type : {event.type}</p>
                    <p className="mt-4 text-sm text-gray-700">{event.description}</p>
                </div>
                <div className="mt-4 flex space-x-3">
                    <Button variant={'default'} size={'lg'} className='w-full sm:w-auto'>S'inscrire</Button>
                    <button className="border border-gray-300 p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                        <ArrowUpRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                <Image
                    src={event.image}
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
