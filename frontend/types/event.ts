export interface EventProps {
    id: string;
    title: string;
    date_start: string;
    date_end: string;
    time_start: string;
    time_end: string;
    description: string;
    image: string;
    badge: string;
    location: string;
    isRecommended: number;
}

export interface PopupCreationEventProps {
    className?: string;
}

export interface PopupJoinPublicEventProps {
    eventId: string;
}