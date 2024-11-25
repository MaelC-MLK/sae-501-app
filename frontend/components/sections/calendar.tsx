"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import "@/app/globals.css";
import { fetchUserEvents, fetchEventsByCreator } from "@/lib/data";
import PopupDeleteEvent from "@/components/sections/popupDeleteEvent";
import PopupUpdateEvent from "@/components/sections/popUpUpdateEvent";
import { deleteEvent } from "@/lib/actions"; // Importer la fonction deleteEvent
import { useUser } from "@/contexts/UserProvider";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Calendar() {
  const [calendarView, setCalendarView] = useState("timeGridWeek");
  const [headerToolbar, setHeaderToolbar] = useState({
    left: "title prev,next today",
    center: "",
    right: "timeGridDay,timeGridWeek,dayGridMonth",
  });
  const [events, setEvents] = useState<
    { id: string; title: string; start: Date; end: Date; isVisible: boolean; creator_id: string }[]
  >([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupDeleteOpen, setIsPopupDeleteOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [filter, setFilter] = useState("all");
  const calendarRef = useRef<FullCalendar>(null);
  const userContext = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const userId = userContext.user ? userContext.user.id : null;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!userContext.user) {
        router.push("/login");
        setLoading(false);
      }
    }, 10); // Timeout de 10 secondes

    if (!userContext.user) {
      return () => clearTimeout(timeoutId);
    }
    loadEvents();
  }, [userContext.user]);

 

  const loadEvents = async () => {
    if (!userContext.user) return;
    const userId = userContext.user.id
      if (userId) {
        try {
          const userEvents = await fetchUserEvents(userId);
          const creatorEvents = await fetchEventsByCreator(userId);
          const combinedEvents = [...userEvents, ...creatorEvents].map(event => ({
            ...event,
            backgroundColor: event.creator_id == userId ? '#FFD700' : '#ADD8E6',
            borderColor: event.creator_id == userId ? '#FFD700' : '#ADD8E6',
          }));
          setEvents(combinedEvents);
          setLoading(false);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des événements de l'utilisateur :",
            error
          );
        }
      }
    }


    
  const handleWindowResize = () => {
    const { innerWidth } = window;
    if (innerWidth < 768) {
      setCalendarView("timeGridDay");
      setHeaderToolbar({
        left: "prev,next",
        center: "title",
        right: "today",
      });
    } else if (innerWidth < 1024) {
      setCalendarView("timeGridWeek");
      setHeaderToolbar({
        left: "title prev,next today",
        center: "",
        right: "timeGridDay,timeGridWeek,dayGridMonth",
      });
    } else {
      setHeaderToolbar({
        left: "title prev,next today",
        center: "",
        right: "timeGridDay,timeGridWeek,dayGridMonth",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(calendarView);
    }
  }, [calendarView]);

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setModalPosition({
        top: clickInfo.jsEvent.clientY,
        left: clickInfo.jsEvent.clientX,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleDeleteClick = async () => {
    if (selectedEvent) {
      try {
        await deleteEvent(selectedEvent.id);
        await loadEvents(); // Recharger les événements après la suppression
        closeModal();
        setIsPopupDeleteOpen(false);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
      }
    }
  };

  const closePopupDelete = () => {
    setIsPopupDeleteOpen(false);
  };

const handleFilterChange = (value: string) => {
    setFilter(value);
};

const filteredEvents = events.filter((event) => {
  if (filter === "all") return true;
  if (filter === "public") return event.isVisible === true;
  if (filter === "private") return event.isVisible === false;
  return true;
});

if (loading) {
  return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
              <p className="mt-4 text-gray-700">Chargement...</p>
          </div>
      </div>
  );
}

  return (
    <div className="calendar-container">
      <div className="fixed bottom-5 right-20 z-50">
        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Visibilité" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Visibilité</SelectLabel>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="public">Publics</SelectItem>
              <SelectItem value="private">Privés</SelectItem>
            </SelectGroup>
          </SelectContent>
      </Select>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin]}
        headerToolbar={headerToolbar}
        initialView={calendarView}
        locale={frLocale}
        allDaySlot={false}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
        }}
        titleFormat={{ year: "numeric", month: "long" }}
        dayHeaderContent={(args) => {
          const date = new Date(args.date);
          const day = date.toLocaleDateString("fr-FR", { weekday: "short" });
          const dayNumber = date.getDate();
          return (
            <div className="flex flex-col text-center">
              <div className="capitalize font-normal">{day}</div>
              <div className="text-2xl font-semibold">{dayNumber}</div>
            </div>
          );
        }}
        events={filteredEvents}
        eventClick={handleEventClick}
      />

      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-md px-6 pb-6 pt-3 absolute text-gray-800"
            style={{ top: modalPosition.top, left: modalPosition.left }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="relative group text-gray-500 hover:text-gray-700 px-1 float-right"
              onClick={closeModal}
            >
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                Fermer
              </div>
              <div className="rounded-full p-2 group-hover:bg-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="size-5 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </button>

            {selectedEvent.extendedProps.creator_id == userId && (
              <>
                <button
                  className="relative group text-gray-500 hover:text-gray-700 px-1 float-right"
                  onClick={() => setIsPopupDeleteOpen(true)}
                >
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                    Supprimer l'événement
                  </div>
                  <div className="rounded-full p-2 group-hover:bg-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="black"
                      className="size-5 shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </div>
                </button>

              
                <PopupUpdateEvent eventData={selectedEvent}/>


              </>
            )}

            <div className="flex flex-row gap-3 mb-3 relative">
              <div
                className="w-4 h-4 rounded-full shrink-0 absolute top-10"
                style={{ backgroundColor: "#FFD700" }}
              ></div>
              <h2 className="text-xl font-semibold ml-7 mt-9 mb-4">
                {selectedEvent.title}
              </h2>
            </div>

            <div className="flex flex-row gap-3 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="black"
                className="size-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>

              <p className="">
                Du {selectedEvent.start.toLocaleString()} au{" "}
                {selectedEvent.end.toLocaleString()}
              </p>
            </div>

            {selectedEvent.extendedProps.location && (
              <div className="flex flex-row gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <p className="mb-4">{selectedEvent.extendedProps.location}</p>
              </div>
            )}

            {selectedEvent.extendedProps.description && (
              <div className="flex flex-row gap-3 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="size-5 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                  />
                </svg>
                <p className="mb-4">{selectedEvent.extendedProps.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isPopupDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <PopupDeleteEvent onClose={closePopupDelete} onDelete={handleDeleteClick} />
        </div>
      )}

    </div>
  );
}