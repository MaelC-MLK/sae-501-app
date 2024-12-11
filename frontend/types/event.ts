import { UserProps } from './user';

export interface EventProps {
    id: number;
    title: string;
    date_start: string;
    date_end: string;
    time_start: string;
    time_end: string;
    isVisible: boolean;
    description: string;
    image: string;
    badge: string;
    location: string;
    isRecommended: number;
    idToken: string;
    users: Array<UserProps>;
    creator: UserProps;
}

export interface PopupCreationEventProps {
    className?: string;
}



export interface PopupUpdateEventProps {
    eventData: any;
    className?: string;
}

export interface PopupJoinPublicEventProps {
    eventId: number;
}