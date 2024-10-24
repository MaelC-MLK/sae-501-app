export interface EventProps {
    id: string;
    title: string;
    date: string;
    time: string;
    type: string;
    description: string;
    image: string;
    badge: string;
}

export interface PopupCreationEventProps {
    className?: string;
}