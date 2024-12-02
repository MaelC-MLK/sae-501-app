import * as React from "react";
import Image from 'next/image';
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { EventProps } from "@/types/event";
import PopupUpdateDraft from "@/components/sections/popUpUpdateDraft";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/lib/actions";
import { k2d } from "@/app/fonts/fonts";

export function CardDraft({ event, onEventChange }: { event: EventProps, onEventChange: () => void }) {
  const defaultImage = "/images/event_default.webp";
  const image = event.image ? `${process.env.API_BASE_URL}/uploads/events/${event.image}` : defaultImage;

  const dateStart = parse(event.date_start, "dd/MM/yyyy - HH:mm", new Date());
  const dateEnd = parse(event.date_end, "dd/MM/yyyy - HH:mm", new Date());

  const formattedDateStart = format(dateStart, "EEEE d MMMM yyyy", { locale: fr });
  const formattedDateEnd = format(dateEnd, "EEEE d MMMM yyyy", { locale: fr });
  const formattedDateStartShort = format(dateStart, "dd/MM/yyyy", { locale: fr });
  const formattedDateEndShort = format(dateEnd, "dd/MM/yyyy", { locale: fr });

  const startTime = format(dateStart, "HH:mm", { locale: fr });
  const endTime = format(dateEnd, "HH:mm", { locale: fr });

  const handleDeleteClick = async () => {
    try {
      await deleteEvent(event.id.toString());
      onEventChange();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement :", error);
    }
  };

    return (
        <div className="border-2 rounded-xl overflow-hidden py-2 px-4 md:px-10 w-full group bg-background relative h-fit">

            <PopupUpdateDraft eventData={event} onEventChange={onEventChange} />

            <Button
                className="absolute top-1/2 translate-y-1 sm:-translate-y-1/2 right-6 sm:right-8 z-30 px-1 float-right bg-background"
                onClick={handleDeleteClick}
                size="icon"
                variant="ghost"
            >
                <div className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>

                </div>
            </Button>

            <div className="absolute left-2/3 top-0 bottom-0 right-0">
                <Image
                    src={image}
                    alt={`${event.title}-image`}
                    layout="fill"
                    objectFit="cover"
                    // width={350}
                    // height={50}
                    unoptimized={true}
                    className=""
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent from-0% to-60%"></div>
            </div>

            <div className="group flex flex-col my-2 w-2/3">
                <p className={`${k2d.className} text-lg md:text-xl font-medium truncate mb-2`}>{event.title}</p>
                <div className="text-muted-foreground flex flex-wrap items-center gap-2 md:gap-3 lg:gap-5">
                    {formattedDateStart === formattedDateEnd ? (
                        <>
                            <div className="flex items-center gap-1 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                </svg>
                                <span className="text-xs md:text-sm font-normal capitalize">
                                    {formattedDateStart}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                <span className="text-xs md:text-sm font-normal capitalize">
                                    {startTime} - {endTime}
                                </span>
                            </div>





                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-1 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                </svg>
                                <span className="text-xs md:text-sm font-normal capitalize">
                                    {formattedDateStartShort} <span className="lowercase">au</span> {formattedDateEndShort}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                                <span className="text-xs md:text-sm font-normal capitalize">
                                    {startTime} - {endTime}
                                </span>
                            </div>

                        </>
                    )}

                    {event.location ? (

                        <div className="flex items-center gap-1 truncate">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <span className="text-xs md:text-sm font-normal capitalize truncate max-w-36">
                                {event.location}
                            </span>
                        </div>
                    ) : null
                    }
                </div>
            </div>
        </div>
    );
}