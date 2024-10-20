'use client'

import * as React from "react"
import { useState } from "react"
import { CardEvent } from "@/components/cards/cardEvent"
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

interface PaginatedEventsProps {
    events: EventProps[]
}

export function PaginatedEvents({ events }: PaginatedEventsProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const eventsPerPage = 6

    const totalPages = Math.ceil(events.length / eventsPerPage)

    const currentEvents = events.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    )

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div
            id="events-list"
            className="flex flex-col justify-center items-center bg-background mx-4 sm:mx-20 border-2 rounded-xl p-4 gap-3 shadow my-12"
        >
            <h2 className="w-full items-start text-2xl font-bold border-b-2">
                Tous les évènements publiques !
            </h2>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {currentEvents.map((event, index) => (
                    <CardEvent key={index} event={event} />
                ))}
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
