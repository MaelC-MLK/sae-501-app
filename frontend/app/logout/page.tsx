"use client";

import React, { useState } from 'react';
import { getBearerToken } from '@/lib/utils';

export default function Page() {
    const [error, setError] = useState('');

    async function logout() {
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