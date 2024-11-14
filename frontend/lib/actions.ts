// /lib/action.ts

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