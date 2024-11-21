// /lib/action.ts

import { error } from "console";

export async function createEvent(eventData: any) {
    console.log(eventData);
    const response = await fetch('http://localhost:8080/api/events', {
        method: 'POST',
        
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            
        },
        body: eventData,
    });

    if (!response.ok) {
        throw new Error('Failed to create event');
    }

    return await response.json();
}

export async function deleteEvent(eventId: string) {
    const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete event');
    }
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


export async function inviteFriend(email: string) {
    const response = await fetch("http://localhost:8080/api/invite", {
        method: "POST",
        headers: {
            "Content-Type": "application/ld+json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            email: email,
        }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
        const errorMessage = responseJson.error || "Erreur lors de l'envoi de l'invitation. Veuillez réessayer.";
        throw new Error(errorMessage);
    }
    return responseJson;
}