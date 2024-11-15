'use client';

import { createContext, useContext, ReactNode } from "react";
import { EventProps } from "@/types/event";

// Créer un contexte pour les événements
const EventContext = createContext<EventProps[]>([]);

interface EventProviderProps {
    children: ReactNode;
    events: EventProps[]; // Accepte les événements comme prop
}

export const EventProvider = ({ children, events }: EventProviderProps) => {
    return (
        <EventContext.Provider value={events}>
            {children}
        </EventContext.Provider>
    );
};

// Hook pour utiliser le contexte des événements
export const useEvents = () => useContext(EventContext);
