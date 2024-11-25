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

interface PaginatedEventsProps {
    events: EventProps[]
}

export function PaginatedEvents({ events }: PaginatedEventsProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const eventsPerPage = 6

    const totalPages = Math.ceil(events.length / eventsPerPage)

    const currentEvents = events.slice(
        (currentPage - 1) * eventsPerPage,
        currentPage * eventsPerPage
    )

    useEffect(() => {
        if (events.length > 0) {
            setLoading(false)
        }
    }, [events])

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div
            id="events-list"
            className="flex flex-col justify-center items-center my-14 scroll-mt-20">
            <h2 className="font-bold max-w-7xl justify-self-center w-full px-5 md:px-10 text-xl md:text-2xl  mb-5">
                Tous les événements publics !
            </h2>

            <div className="w-full justify-self-center max-w-7xl flex flex-wrap gap-4 mt-2 items-center justify-center px-5">
                {loading ? (
                    Array.from({ length: eventsPerPage }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))
                ) : (
                    currentEvents.map((event, index) => (
                        <CardEvent key={index} event={event} />
                    ))
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