"use client";

import { EventProps } from '@/types/event';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface EventProviderProps {
    children: ReactNode; // Specify that children can be any valid React node
}

const EventContext = createContext<EventProps[]>([]); // Assuming EventProps is defined somewhere

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
    const [events, setEvents] = useState<EventProps[]>([]); // Replace EventProps with your actual type

    useEffect(() => {
        fetch('http://localhost:8080/api/events/public')
            .then(response => response.json())
            .then(data => setEvents(data))
            .catch(error => console.error("Erreur lors de la récupération des événements :", error));
    }, []);

    return (
        <EventContext.Provider value={events}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    return useContext(EventContext);
};
