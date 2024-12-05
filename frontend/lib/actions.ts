// /lib/action.ts

import { error } from "console";
import { loadEvents } from "@/components/sections/calendar";

export async function createEvent(eventData: any) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/events`, {
        method: 'POST',
        credentials: 'include',
        headers: {
        },
        body: eventData,
    });
    if (!response.ok) {
        throw new Error('Failed to create event');
    }
    const newEvent = await response.json();
    await loadEvents();
    return newEvent;
}

export async function UpdateEvent(eventData: any, eventId: string) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/events/${eventId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/merge-patch+json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(eventData),
    });
    if (!response.ok) {
        throw new Error('Failed to update event');
    }
    const updatedEvent = await response.json();
    await loadEvents(); // Recharger les événements après la mise à jour
    return updatedEvent;
}

export async function deleteEvent(eventId: string) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/ld+json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete event');
    }
}


export async function signUserInvite(email: any, eventId: any) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/user/email`, {
        method: "POST",
        credentials: 'include',
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
    const response = await fetch(`${process.env.API_BASE_URL}/api/invite`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/ld+json",
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

export async function inviteToEvent(email: string, eventId: Number) {
    console.log("Envoi de l'invitation avec :", email, eventId);

    const response = await fetch(`${process.env.API_BASE_URL}/api/events/invite`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({
            email: email,
            eventId: eventId,
        }),
    });
    
    const responseJson = await response.json(); // Lit le corps une seule fois
    
    if (!response.ok) {
        const errorMessage = responseJson.message || "Erreur lors de l'envoi de l'invitation. Veuillez réessayer.";
        console.error("Erreur API :", errorMessage); // Utilise la réponse déjà extraite
        throw new Error(errorMessage);
    }
    
    console.log("Réponse API réussie :", responseJson); // Utilisation directe
    return responseJson;
}

export async function UpdateUser(user: any) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
    }
    const updatedUser = await response.json();
    return updatedUser;
}

export async function UpdateUserImage(user: any, image: any) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/users/${user.id}/update-image`, {
        method: 'POST',
        credentials: 'include',
        body: image,
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'image');
    }
    const updatedUser = await response.json();
    return updatedUser;
}

export async function UpdateEventImage(id: any, image: any) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/events/${id}/update-image`, {
        method: 'POST',
        credentials: 'include',
        body: image,
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'image');
    }
    const updatedEvent = await response.json();
    return updatedEvent;

}

export async function deleteEventAndNotify(id: number) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/events/${id}/notify-delete`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'événement et de l\'envoi de la notification');
    }
    const result = await response.json();
    return result;
}

export async function UpdateEventAndNotify(id: number){
    const response = await fetch(`${process.env.API_BASE_URL}/api/events/${id}/notify-update`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'événement et de l\'envoi de la notification');
    }
    const result = await response.json();
    return result;
}

export async function CreateEventAndNotify(id: number){
    const response = await fetch(`${process.env.API_BASE_URL}/api/events/${id}/notify-create`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'événement et de l\'envoi de la notification');
    }
    const result = await response.json();
    return result;
}