export interface UserProps {
    id: string;
    email: string;
    firstName: null | string;
    lastName: null | string;
    avatar: null | string;
}

export interface UserRegister {
    email: string,
    plainPassword: string,
    firstName: string,
    lastName: string,
}