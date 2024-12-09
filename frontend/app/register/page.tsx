"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/contexts/UserProvider';
import { k2d } from "@/app/fonts/fonts"
import { useRouter } from 'next/navigation';
import { PopUpEmailRegister } from '@/components/sections/popUpEmailRegister';

export default function Page() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [plainPassword, setPlainPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [loadingButton, setLoadingButton] = useState(false);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState({ email: email, plainPassword: plainPassword, firstName: firstName, lastName: lastName });
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8 && password.length <= 30;
    };

    const validateNoNumbersOrSpecialChars = (str: string) => {
        const noNumbersOrSpecialCharsRegex = /^[a-zA-Z\s-]+$/;
        return noNumbersOrSpecialCharsRegex.test(str);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLoadingButton(true);
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            setLoadingButton(false);
            return;
        }

        if (!validatePassword(plainPassword)) {
            setError('Password must be between 8 and 30 characters.');
            setLoadingButton(false);
            return;
        }

        if (plainPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setLoadingButton(false);
            return;
        }

        if (!validateNoNumbersOrSpecialChars(firstName)) {
            setError('Le prénom doit contenir uniquement des lettres ou - ');
            setLoadingButton(false);
            return;
        }

        if (!validateNoNumbersOrSpecialChars(lastName)) {
            setError('Le nom doit contenir uniquement des lettres ou - ');
            setLoadingButton(false);
            return;
        }

        if (!acceptedTerms) {
            setError('Vous devez accepter les conditions d\'utilisation et la politique de confidentialité.');
            setLoadingButton(false);
            return;
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const api = process.env.API_BASE_URL;
            const url = api + '/api/user/register';

            setUser({
                email: email,
                plainPassword: plainPassword,
                firstName: firstName,
                lastName: lastName
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/ld+json",
                },
                body: JSON.stringify({ email: email, plainPassword: plainPassword, firstName: firstName, lastName: lastName }),
            });

            if (!response.ok) {
                if (response.status === 422) {
                    throw new Error('Cette adresse email existe déjà');
                }

                throw new Error('Echec de la création du compte');
            } else {
                setLoadingButton(false);
                setOpen(true);
            }
        } catch (err) {
            setLoadingButton(false);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Une erreur est survenue');
            }
        }
    };

    return (
        <div className="flex h-full">
            <div className="flex flex-col justify-items-center md:w-2/3 p-4 pt-16 sm:pt-24 mx-auto lg:mx-0 lg:px-34">
                <h1 className={`${k2d.className} text-3xl font-bold mb-6`}>Rejoignez notre communauté</h1>

                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <Label className='text-lg' htmlFor="firstName">Prénom*</Label>
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
                        <Label className='text-lg' htmlFor="lastName">Nom*</Label>
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
                        <Label className='text-lg' htmlFor="email">Adresse mail*</Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="Adresse mail"
                            name="email"
                            required
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md text-md h-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="mb-6 relative">
                        <Label className="text-lg" htmlFor="plainPassword">Mot de passe*</Label>
                        <div className="relative w-full">
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="plainPassword"
                                placeholder="**********"
                                name="plainPassword"
                                required
                                className="mt-1 w-full p-2 pr-10 border border-gray-300 rounded-md text-md h-10"
                                value={plainPassword}
                                onChange={(e) => setPlainPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 transform -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <img
                                    src={showPassword ? "/images/show.svg" : "/images/no-show.svg"}
                                    alt="Toggle Password Visibility"
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 relative">
                        <Label className="text-lg" htmlFor="confirmPassword">Confirmer le mot de passe*</Label>
                        <div className="relative w-full">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="**********"
                                name="confirmPassword"
                                required
                                className="mt-1 w-full p-2 pr-10 border border-gray-300 rounded-md text-md h-10"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 transform -translate-y-1/2"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <img
                                    src={showConfirmPassword ? "/images/show.svg" : "/images/no-show.svg"}
                                    alt="Toggle Password Visibility"
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>
                    </div>


                    <div className="flex items-center mt-6 mb-3">
                        <Checkbox
                            id="terms"
                            checked={acceptedTerms}
                            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                        />
                        <Label htmlFor="terms" className="ml-2">
                            J'accepte les <Link href="/conditions-utilisation" className="text-primary hover:underline">conditions d'utilisation</Link> et la <Link href="/politique-confidentialite" className="text-primary hover:underline">politique de confidentialité</Link>.
                        </Label>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button
                        type="submit"
                        className="w-full bg-primary text-white text-lg py-6 rounded-md transition"
                        disabled={loadingButton || !acceptedTerms}
                    >
                        {loadingButton ? "Inscription..." : "S'inscrire"}
                    </Button>
                </form>

                <PopUpEmailRegister user={user} open={open} setOpen={setOpen}></PopUpEmailRegister>

                <p className="text-center text-sm text-gray-500 mt-2">
                    Vous avez déjà un compte? <Link href="/login" className="text-primary hover:underline">Connectez-vous</Link>
                </p>
            </div>

            <div className="hidden overflow-y-auto lg:block lg:right-0 lg:fixed lg:h-full lg:inset-0 lg:left-auto lg:w-1/3 z-0 ">
                <Image src="/images/register-picture.png" alt="Photo" layout="fill" objectFit="cover" />
            </div>
        </div>
    );
};