"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authenticate } from "@/lib/utils";
import { useUser } from '@/contexts/UserProvider';
import { UserProps } from "@/types/user";
import { set } from 'date-fns';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { k2d } from "@/app/fonts/fonts"


export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const login = await authenticate(email, password, setUser);
            if (login) {
                router.push('/');
            }
            else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            {loading ? (
            <div className="flex items-center justify-center min-h-screen w-full">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-4 border-gray-200"></div>
                <p className="mt-4 text-gray-700">Authenticating...</p>
            </div>
        </div>
            ) : (
                <div className='flex min-h-screen'>
                    <div className="flex flex-col justify-center w-full md:w-2/3 max-w-sm mx-auto mt-4 py-24">
                        <h1 className={`${k2d.className} text-3xl font-bold mb-6`}>Heureux de vous revoir parmi nous !</h1>
                        
                        <form onSubmit={handleSubmit}>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="mb-4">
                                <Label htmlFor="email" className='text-lg'>Adresse mail*</Label>
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
                                <Label htmlFor="password" className='text-lg'>Mot de passe*</Label>
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
                            <div className="text-right mb-6">
                                <a href="#" className="text-primary hover:underline text-sm">Mot de passe oublié ?</a>
                            </div>
                            
                            <div className='flex flex-col'>
                                <Button type="submit" className="w-full py-6 text-lg rounded-md transition">
                                Se connecter
                                </Button>
                                <div className="text-center mt-2">
                                    <p className="text-sm">Vous n'avez pas de compte ? <a href="#" className="text-primary hover:underline">Inscrivez-vous</a></p> 
                                </div>
                            </div>
                            
                        </form>
        
                    </div>
                    <div className='hidden md:block md:w-1/3 relative'>
                        <Image src='/images/login-picture.png' alt='image connexion' fill 
                        style={{ objectFit: 'cover' }}/>
                    </div>
                </div>
                
            )}
        </div>
    );
}