export interface EventProps {
    id: number;
    title: string;
    date_start: string;
    date_end: string;
    description: string;
    image: string;
    location: string;
}

export interface PopupCreationEventProps {
    className?: string;
}