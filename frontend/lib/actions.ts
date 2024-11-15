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
