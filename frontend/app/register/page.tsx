"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import { authenticate } from "@/lib/utils"


export default function Page() {

    const [email, setEmail] = useState('');
    const [plainPassword, setPlainPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const api = 'http://localhost:8080';
            const url = api + '/api/users';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/ld+json",
                },
                body: JSON.stringify({ email, plainPassword }),
            });

            if (!response.ok) {
                throw new Error('Failed to login');
            }
            else {
                await authenticate(email, plainPassword, '/register/success');
            }

        } catch (err) {
            setError('Invalid email or password');
        }
    };
    
    return (
        <div className="flex h-screen">
            <div className="flex flex-col justify-center w-2/3 max-w-md mx-auto p-12">
                <h1 className="text-2xl font-bold mb-6">Create an account</h1>
                
                <div className="mb-10">
                    <Button className="w-full bg-blue-500 text-white py-6 rounded-md text-lg mb-3 hover:bg-blue-600 transition">
                        Sign up with Google
                    </Button>
                    <Button className='w-full py-6 text-lg' variant="outline">Sign up with Apple</Button>
                </div>

                <div className="flex items-center justify-center mb-6">
                    <div className="w-full border-t border-gray-300"></div>
                    <span className="px-3 text-gray-500">or</span>
                    <div className="w-full border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label className='text-lg' htmlFor="email">Email</Label>
                        <Input 
                            type="email" 
                            id="email" 
                            placeholder="E-mail"
                            name="email" 
                            required 
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md text-md h-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="mb-6">
                        <Label className='text-lg' htmlFor="plainPassword">Password</Label>
                        <Input 
                            type="password" 
                            id="plainPassword" 
                            placeholder="Password" 
                            name="plainPassword" 
                            required 
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md text-md h-10" 
                            value={plainPassword}
                            onChange={(e) => setPlainPassword(e.target.value)}/>
                    </div>
                    <Button type="submit" className="w-full bg-blue-500 text-white text-lg py-6 rounded-md hover:bg-blue-600 transition">
                        Sign up
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account? <a href="#" className="text-blue-500 hover:underline">Log in</a>
                </p>
            </div>

            <div className="hidden lg:block relative h-full w-1/3">
                <Image src="/images/img-register-form.png" alt="Photo" layout="fill" objectFit="cover" />
            </div>
        </div>
    );
};

