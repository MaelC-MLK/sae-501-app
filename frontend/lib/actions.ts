// /lib/action.ts

import { error } from "console";

export async function createEvent(eventData: any) {
    const response = await fetch('http://localhost:8080/api/events', {
        method: 'POST',
        
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            
        },
        body: JSON.stringify(eventData),
    });

    if (!response.ok) {
        throw new Error('Failed to create event');
    }

    return await response.json();
}

export async function signUserInvite(email: any, eventId: any) {
    const response = await fetch("http://localhost:8080/api/user/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({
            email: email,
            eventId: eventId,
        }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
        if (responseJson.error && responseJson.error.includes("already registered")) {
            throw new Error("Vous êtes déjà inscrit à cet événement.");
        }
        throw new Error("Erreur lors de l'inscription. Veuillez réessayer.");
    }
    return await responseJson;
}