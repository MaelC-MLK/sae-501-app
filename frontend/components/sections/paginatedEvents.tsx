import React, { useState, useEffect } from 'react';
import { EventProps } from "@/types/event";
import { CardEvent } from "@/components/cards/cardEvent"
import { SkeletonCard } from "@/components/skeletons/skeletons"
import { Input } from "../ui/input"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const PaginatedEvents = () => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [sortOrder, setSortOrder] = useState('mostRecent');
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const itemsPerPage = 6;

  const fetchEvents = async (page: number, search: string, location: string, order: string, start: string, end: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/events?page=${page}&limit=${itemsPerPage}&search=${search}&location=${location}&order=${order}&startDate=${start}&endDate=${end}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des événements');

      const data = await response.json();
      setEvents(data.events);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Erreur :', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEvents(currentPage, searchQuery, location, sortOrder, startDate ? startDate.toISOString() : '', endDate ? endDate.toISOString() : '');
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery, location, sortOrder, startDate, endDate]);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div
      id="events-list"
      className="flex flex-col justify-center items-center my-14 scroll-mt-20"
    >
      <div className="w-full flex flex-col justify-center items-start max-w-7xl mb-5 gap-5 px-4 sm:px-10">
        <h2 className="font-bold justify-self-center text-xl md:text-2xl text-nowrap">
          Tous les événements !
        </h2>
        <div className="flex flex-col w-full items-end gap-2">
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex md:flex-row flex-col gap-2 w-full">
            <div className='flex flex-col sm:flex-row gap-2 w-full'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className='w-4 mr-2' />
                    {startDate ? format(startDate, "PPP") : <span>Date de début</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal ",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className='w-4 mr-2' />
                    {endDate ? format(endDate, "PPP") : <span>Date de fin</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex flex-row gap-2 w-full'>
              <Input
                type="text"
                placeholder="Où ?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              />
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="">
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
      </div>
      <div className="flex flex-col items-center gap-4 w-full px-4 sm:px-10 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {isLoading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : events.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              Aucun résultat
            </div>
          ) : (
            events.map((event) => <CardEvent event={event} key={event.id} />)
          )}
        </div>
        <div className="flex items-center justify-center w-full max-w-md mt-4">
          <button
            className="flex flex-row items-center gap-1 px-4 py-2 hover:bg-gray-100 rounded-md disabled:opacity-50 text-sm font-medium duration-150"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Précédent
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`h-9 w-9 rounded-md text-sm font-medium duration-150 hover:bg-gray-100 ${currentPage === index + 1 ? 'border border-gray-200' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            className="flex flex-row items-center gap-1 px-4 py-2 hover:bg-gray-100 rounded-md disabled:opacity-50 text-sm font-medium duration-150"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Suivant
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginatedEvents;
