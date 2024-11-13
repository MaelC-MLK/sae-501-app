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

export async function uploadEventImage(file: File, id: string) {
    const formData = new FormData();
    formData.append('file', file);

    console.log('file', file);

    const response = await fetch(`http://localhost:8080/api/events/${id}/image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    return await response.json();
}