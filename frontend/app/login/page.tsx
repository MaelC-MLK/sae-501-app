"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        

        try {
            const api = 'http://localhost:8080';
            const url = api + '/auth';

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

            window.location.href = '/';
        } catch (err) {
            console.log(err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex h-screen">
            <div className="flex flex-col justify-center md:w-2/3 max-w-md mx-auto p-12">
                <h1 className="text-3xl font-bold mb-8">Welcome back!</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="email" className='text-lg'>Email*</Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="Email"
                            name="email"
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md text-md h-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <Label htmlFor="password" className='text-lg'>Password*</Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="Password"
                            name="password"
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md text-md h-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="text-right mb-6">
                        <a href="#" className="text-blue-500 hover:underline text-sm">Forgot Password?</a>
                    </div>
                    
                    <Button type="submit" className="w-full bg-blue-500 text-white py-6 text-lg rounded-md hover:bg-blue-600 transition">
                        Login
                    </Button>
                </form>
                
                <div className="flex items-center justify-center my-4">
                    <div className="w-1/3 border-t border-gray-300"></div>
                    <p className="mx-3 text-gray-500">or</p>
                    <div className="w-1/3 border-t border-gray-300"></div>
                </div>
                
                <div className="flex gap-2 mb-6">
                    <Button className="w-full bg-blue-500 text-white py-6 rounded-md sm:text-lg mb-3 hover:bg-blue-600 transition">
                        Log in with Google
                    </Button>
                    <Button className="w-full py-6 sm:text-lg rounded-md transition" variant={'outline'}>
                        Log in with Apple
                    </Button>
                </div>
            </div>
        </div>
    );
}