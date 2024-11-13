// /lib/action.ts

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


export async function signUserInvite(email: any) {
    const response = await fetch("http://localhost:8080/api/users/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({
            email: email,
        }),
    });

    if (!response.ok) {
        throw new Error("Erreur lors de l'inscription. Veuillez réessayer.");
    }

    return await response.json();
}