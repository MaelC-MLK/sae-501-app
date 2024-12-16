'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { CardEvent } from "@/components/cards/cardEvent"
import { SkeletonCard } from "@/components/skeletons/skeletons"
import { EventProps } from "@/types/event";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input"

interface PaginatedEventsProps {
    events: EventProps[];
}

function parseDate(dateString: string): Date {
    const [datePart, timePart] = dateString.split(" - ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
}


export function PaginatedEventsUnused({ events }: PaginatedEventsProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const eventsPerPage = 6
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState<EventProps[]>([]);
    const [sortOrder, setSortOrder] = useState('mostRecent');
    const [location, setLocation] = useState('');

    const totalPages = Math.ceil(events.length / eventsPerPage)

    useEffect(() => {
        if (events.length > 0) {
            setLoading(false)
        }
    }, [events])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            console.log("Tri des événements avec ordre :", sortOrder);

            let sortedEvents = events.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                event.location.toLowerCase().includes(location.toLowerCase())
            );

            sortedEvents = sortedEvents.sort((a, b) => {
                const dateA = parseDate(a.date_start).getTime();
                const dateB = parseDate(b.date_start).getTime();
                return sortOrder === "mostRecent" ? dateA - dateB : dateB - dateA;
            });

            console.log("Événements triés :", sortedEvents);
            setFilteredEvents(sortedEvents);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, events, sortOrder, location]);




    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handleSearchChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setSearchTerm(e.target.value);
    };

    const handleLocationChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setLocation(e.target.value);
    };

    const currentEvents = filteredEvents.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    )

    return (
        <div
            id="events-list"
            className="flex flex-col justify-center items-center my-14 scroll-mt-20"
        >
            <div className="flex lg:flex-row flex-col justify-between items-center w-full max-w-7xl mb-2 sm:mb-5 gap-2">
                <h2 className="font-bold justify-self-center md:px-10 text-xl md:text-2xl text-nowrap">
                    Tous les événements !
                </h2>
                <div className="flex flex-col md:flex-row max-w-4xl w-full items-center px-4 sm:px-10 gap-2">
                    <Input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className="flex flex-row gap-2 w-full">
                        <Input
                            type="text"
                            placeholder="Où ?"
                            value={location}
                            onChange={handleLocationChange}
                            className="w-full"
                        />
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="w-[210px]">
                                <SelectValue placeholder="Trier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Trier</SelectLabel>
                                    <SelectItem value="mostRecent">Du plus au moins récent</SelectItem>
                                    <SelectItem value="leastRecent">Du moins au plus récent</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="w-full justify-self-center max-w-7xl flex flex-wrap gap-4 mt-2 items-center justify-center px-5">
                {loading ? (
                    Array.from({ length: eventsPerPage }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))
                ) : currentEvents.length > 0 ? (
                    currentEvents.map((event, index) => (
                        <CardEvent key={index} event={event} />
                    ))
                ) : (
                    <div className="h-96 flex items-center">
                        <p>Aucun événement trouvé.</p>
                    </div>
                )}
            </div>

            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
                            className={`${currentPage === 1 ? "opacity-50 select-none" : "cursor-pointer"}`}
                        />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                isActive={currentPage === index + 1}
                                onClick={() => handlePageClick(index + 1)}
                                className="cursor-pointer"
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {totalPages > 5 && <PaginationEllipsis />}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}
                            className={`${currentPage === totalPages ? "opacity-50 select-none" : "cursor-pointer"}`}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}