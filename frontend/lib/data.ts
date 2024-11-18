import { getBearerToken } from '@/lib/utils';
import { parse } from 'date-fns';

export async function fetchUserEvents(userId: string) {
    const token = getBearerToken();
    if (!token) {
        throw new Error('JWT Token not found');
    }

    const response = await fetch(`http://localhost:8080/api/events/user/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
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