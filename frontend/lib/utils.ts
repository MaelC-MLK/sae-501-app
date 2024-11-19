import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UserProps } from "@/types/user"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function authenticate(
    email: string, 
    password: string, 
    redirect: string,
    setUser: (user: UserProps | null) => void
) 
{
    if (!email || !password) {
        throw new Error('Invalid email or password');
    }

    const api = 'http://localhost:8080';
    const url = api + '/api/auth';

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    const data = await response.json();

    // Mettez à jour le contexte utilisateur
    const user: UserProps = {
        id: data.id,
        email: data.email,
        firstName: data.firstname || null ,
        lastName: data.lastname || null ,
        avatar: data.avatar || null ,
    };

    console.log('Login user:', user);

    setUser(user);

    // window.location.href = redirect;
}



