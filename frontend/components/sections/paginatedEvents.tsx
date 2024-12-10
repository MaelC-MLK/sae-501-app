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
import { Input } from "../ui/input"

interface PaginatedEventsProps {
    events: EventProps[]
}

export function PaginatedEvents({ events }: PaginatedEventsProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const eventsPerPage = 6
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [sortOrder, setSortOrder] = useState('mostRecent');

    const totalPages = Math.ceil(events.length / eventsPerPage)

    useEffect(() => {
        if (events.length > 0) {
            setLoading(false)
        }
    }, [events])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            let sortedEvents = [...events].filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (sortOrder === 'mostRecent') {
                sortedEvents.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
            } else {
                sortedEvents.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
            }

            setFilteredEvents(sortedEvents);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, events, sortOrder]);

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handleSearchChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setSortOrder(e.target.value);
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
            <div className="flex md:flex-row flex-col justify-between items-center w-full max-w-7xl mb-5 gap-2">
                <h2 className="font-bold justify-self-center md:px-10 text-xl md:text-2xl">
                    Tous les événements publics !
                </h2>
                <div className="flex w-full max-w-md items-center space-x-2 md:px-10">
                    <Input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <select value={sortOrder} onChange={handleSortChange}>
                        <option value="mostRecent">Du plus récent au moins récent</option>
                        <option value="leastRecent">Du moins récent au plus récent</option>
                    </select>
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
                    <p>Aucun événement trouvé.</p>
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