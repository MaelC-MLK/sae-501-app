"use client";

import React, { useState } from 'react';
import { getBearerToken } from '@/lib/utils';

export default function Page() {
    const [error, setError] = useState('');

    async function logout() {
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