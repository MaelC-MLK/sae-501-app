"use client";

import React, { useState } from 'react';
import { getBearerToken } from '@/lib/utils';

export default function Page() {
    const [error, setError] = useState('');

    async function logout() {
        const api = 'http://localhost:8080';
        const url = api + '/api/token/invalidate';
        const token = getBearerToken();

        if(!token) {
            throw new Error('No token found');
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }),
        });

        if (!response.ok) {
            // Unauthorized
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                throw new Error('Failed to logout');
            }
            throw new Error('Failed to logout');
        }

        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    }

    try {
        logout();
    } catch (err) {
        setError('Failed to logout');
        window.location.href = '/login';
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-4 border-gray-200"></div>
                <h1 className="text-3xl font-bold mt-8">Logging out...</h1>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </div>
        </div>
    );
}