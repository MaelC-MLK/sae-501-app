"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import "@/app/globals.css";
import { fetchUserEvents } from "@/lib/data";
import { getUserIdFromToken } from "@/lib/utils";
import PopupDeleteEvent from "@/components/sections/popupDeleteEvent";
import { deleteEvent } from "@/lib/actions"; // Importer la fonction deleteEvent

export default function Calendar() {
  const [calendarView, setCalendarView] = useState("timeGridWeek");
  const [headerToolbar, setHeaderToolbar] = useState({
    left: "title prev,next today",
    center: "",
    right: "timeGridDay,timeGridWeek,dayGridMonth",
  });
  const [events, setEvents] = useState<
    { id: string; title: string; start: Date; end: Date }[]
  >([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupDeleteOpen, setIsPopupDeleteOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const userId = getUserIdFromToken();
    if (userId) {
      try {
        const events = await fetchUserEvents(userId);
        setEvents(events);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des événements de l'utilisateur :",
          error
        );
      }
    }
  };

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
    handleWindowResize(); // Initial call to set the view based on the current window size
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

  return (
    <div className="m-8 md:m-16 calendar-container">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin]}
        headerToolbar={headerToolbar}
        initialView={calendarView}
        locale={frLocale}
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
        events={events}
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

            <button
              className="relative group text-gray-500 hover:text-gray-700 px-1 float-right"
              onClick={() => console.log("Modifier")}
            >
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                Modifier l'événement
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
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </div>
            </button>
            <div className="flex flex-row gap-3 mt-9 mb-4 relative">
            <div
              className="w-4 h-4 rounded-full shrink-0 absolute top-1"
              style={{ backgroundColor: "#9A9CFF" }}
            ></div>
            <h2 className="text-xl font-semibold ml-6">
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
            <div className="flex flex-row gap-3">
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
