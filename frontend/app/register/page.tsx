"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import { authenticate } from "@/lib/utils"
import Link from 'next/link';


export default function Page() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [plainPassword, setPlainPassword] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8 && password.length <= 30;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!validatePassword(plainPassword)) {
            setError('Password must be between 8 and 30 characters.');
            return;
        }


        try {
            const api = 'http://localhost:8080';
            const url = api + '/api/users';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/ld+json",
                },
                body: JSON.stringify({ email, plainPassword, firstName, lastName, birthDate}),
            });

            if (!response.ok) {
                if(response.status === 422) {
                    throw new Error('Email already exists');
                }

                throw new Error('Failed to create account');
            }
            else {
                await authenticate(email, plainPassword, '/register/success');
            }

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };
    
    return (
        <div className="flex h-full">
            <div className="flex flex-col justify-items-center lg:w-2/3 p-6 sm:p-12 lg:p-24 lg:px-56">
                <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>
                
                <div className="mb-10">
                    <Button className="w-full bg-blue-500 text-white py-6 rounded-md text-lg mb-3 hover:bg-blue-600 transition">
                    S'inscrire avec Google
                    </Button>
                    <Button className='w-full py-6 text-lg' variant="outline">S'inscrire avec Apple</Button>
                </div>

                <div className="flex items-center justify-center mb-6">
                    <div className="w-full border-t border-gray-300"></div>
                    <span className="px-3 text-gray-500">or</span>
                    <div className="w-full border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleSubmit}>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <div className="mb-4">
                        <Label className='text-lg' htmlFor="firstName">Prénom</Label>
                        <Input 
                            type="text" 
                            id="firstName" 
                            placeholder="Prénom"
                            name="firstName" 
                            required 
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md text-md h-10"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div className="mb-4">
                        <Label className='text-lg' htmlFor="lastName">Nom</Label>
                        <Input 
                            type="text" 
                            id="lastName" 
                            placeholder="Nom"
                            name="lastName" 
                            required 
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md text-md h-10"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} />
                    </div>

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
                        <Label className='text-lg' htmlFor="plainPassword">Mot de passe</Label>
                        <Input 
                            type="password" 
                            id="plainPassword" 
                            placeholder="Mot de passe" 
                            name="plainPassword" 
                            required 
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md text-md h-10" 
                            value={plainPassword}
                            onChange={(e) => setPlainPassword(e.target.value)}/>
                    </div>
                    <Button type="submit" className="w-full bg-blue-500 text-white text-lg py-6 rounded-md hover:bg-blue-600 transition">
                        S'incrire
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                Vous avez déjà un compte? <Link href="/login" className="text-blue-500 hover:underline">Connectez-vous</Link>
                </p>
            </div>

            <div className="hidden overflow-y-auto lg:block lg:right-0 lg:fixed lg:h-full lg:inset-0 lg:left-auto lg:w-1/3 z-0 ">
                <Image src="/images/img-register-form.png" alt="Photo" layout="fill" objectFit="cover" />
            </div>
        </div>
    );
};

