"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Page() {
    
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
            throw new Error('Failed to logout');
        }

        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    }

    logout()

    return (
        <div className="flex h-screen">
            <div className="flex flex-col justify-center md:w-2/3 max-w-md mx-auto p-12">
                <h1 className="text-3xl font-bold mb-8">Logging out...</h1>
            </div>
        </div>
    );
}