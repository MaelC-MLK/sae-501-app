import { UserProps } from './user';

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
    users: Array<UserProps>;
}

export interface PopupCreationEventProps {
    className?: string;
}



export interface PopupUpdateEventProps {
    eventData: any;
    className?: string;
}

export interface PopupJoinPublicEventProps {
    eventId: string;
}