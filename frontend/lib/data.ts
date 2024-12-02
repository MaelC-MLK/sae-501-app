import { parse } from 'date-fns';

export async function fetchUserBy(value: string) {

    const response = await fetch(`${process.env.API_BASE_URL}/api/users?query=${value}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return await response.json();
}

export async function fetchUserEvents(userId: string) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/events/user/${userId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error('Failed to fetch user events');
        }
    
        const data = await response.json();
        return data.map((event: any) => ({
            ...event,
            start: parse(event.date_start, 'dd/MM/yyyy - HH:mm', new Date()),
            end: parse(event.date_end, 'dd/MM/yyyy - HH:mm', new Date()),
        }));
    }

export async function fetchEventsByCreator(creatorId: string) {

    const response = await fetch(`${process.env.API_BASE_URL}/api/events/creator/${creatorId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des événements');
    }

    const data = await response.json();
    return data.map((event: any) => ({
        ...event,
        start: parse(event.date_start, 'dd/MM/yyyy - HH:mm', new Date()),
        end: parse(event.date_end, 'dd/MM/yyyy - HH:mm', new Date()),
    }));
}

export const checkUserRegistration = async (user: any, eventId: number): Promise<boolean | null> => {
    if (!user || !eventId) return null;

    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/events/${eventId}/is-registered`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.isRegistered;
        } else {
            console.error(`Error ${response.status}: Unable to check registration`);
            return null;
        }
    } catch (error) {
        console.error('Une erreur est survenue', error);
        return null;
    }
};

export async function joinEvent(eventId: number) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/events/${eventId}/join`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Echec lors de l\'inscription à l\'événement');
    }

    return await response.json();
}

export async function unregisterEvent(eventId: number) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/events/${eventId}/unregister`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Echec de la désinscription à l\'événement');
    }

    return await response.json();
}

export async function fetchUserById(userId: string) {
    const response = await fetch(`${process.env.API_BASE_URL}/api/users/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données utilisateur');
    }

    return await response.json();
}