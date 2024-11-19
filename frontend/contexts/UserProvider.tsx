'use client';

import { createContext, useContext, useState, ReactNode } from "react";
import { UserProps } from "@/types/user"; // Assurez-vous que le chemin est correct

interface UserContextProps {
    user: UserProps | null;
    setUser: (user: UserProps | null) => void;
}

const UserContext = createContext<UserContextProps | null>(null);

interface UserProviderProps {
    children: ReactNode;
    initialUser: UserProps | null; 
}

export const UserProvider = ({ children, initialUser }: UserProviderProps) => {
    const [user, setUser] = useState<UserProps | null>(initialUser);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};