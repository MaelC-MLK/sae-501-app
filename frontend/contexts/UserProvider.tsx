'use client';

import { createContext, useContext, useState, ReactNode } from "react";
import { UserProps } from "@/types/user"; // Assurez-vous que le chemin est correct
import { useEffect } from 'react';

interface UserContextProps {
    user: UserProps | null;
    setUser: (user: UserProps | null) => void;
}

const UserContext = createContext<UserContextProps | null>(null);

interface UserProviderProps {
    children: ReactNode;
    initialUser: UserProps | null; 
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<UserProps | null>(null);

    const fetchUser = async () => {
        try {
            const api = 'http://localhost:8080';
            const url = api + '/api/auth/me';

            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
            else {
                setUser(null);
            }
        } catch (error) {
            console.error('An error occurred while fetching user data', error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []); // Appeler fetchUser lors du montage du composant

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