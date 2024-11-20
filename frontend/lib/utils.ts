import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {jwtDecode} from 'jwt-decode';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function authenticate(
    email: string, 
    password: string, 
    redirect: string
) 
{
    if (!email || !password) {
        throw new Error('Invalid email or password');
    }

    const api = 'http://localhost:8080';
    const url = api + '/api/auth';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Failed to login');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('refresh_token', data.refresh_token);

    window.location.href = redirect;
}

interface JwtPayload {
    sub: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    exp: number;
    iat: number;
    roles: string[];
}

export function getUserFromToken(token: string): JwtPayload | null {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded;
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
}

export function getBearerToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    return token;
}

export function getUserIdFromToken(): string | null {
    const token = getBearerToken();
    if (!token) {
        console.error('JWT Token not found');
        return null;
    }

    const user = getUserFromToken(token);
    if (!user) {
        console.error('Invalid token');
        return null;
    }

    return user.sub; 
}

export async function refreshToken() {
    if (localStorage.getItem('refresh_token')) {
        const refreshToken = localStorage.getItem('refresh_token');

        const response = await fetch('/api/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
        } else {
            window.location.href = '/login';
        }
    }
    else {
        window.location.href = '/login';
    }
  
}