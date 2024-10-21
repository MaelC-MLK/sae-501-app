"use client";

import React, { useState } from 'react';


export default async function Page() {
    const [error, setError] = useState('');

    async function logout() {
        const api = 'http://localhost:8080';
        const url = api + '/api/token/invalidate';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }),
        });

        if (!response.ok) {
            // Unauthorized
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
            throw new Error('Failed to logout');
        }

        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    }

    try {
        await logout();
    } catch (err) {
        setError('Failed to logout');
    }

    return (
        <div className="flex h-screen">
            <div className="flex flex-col justify-center md:w-2/3 max-w-md mx-auto p-12">
                <h1 className="text-3xl font-bold mb-8">Logging out...</h1>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </div>
    );
}