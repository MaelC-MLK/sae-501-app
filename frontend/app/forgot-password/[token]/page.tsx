'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loading } from '@/components/ui/loading';
import { Check, CheckCircleIcon } from 'lucide-react';

export default function ForgotPasswordPage({ params }: { params: { token: string } }) {
    const { token } = params;
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'input' | null>('input');
    const [message, setMessage] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validatePassword = (password: string) => {
        return password.length >= 8 && password.length <= 30;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validatePassword(password)) {
            setLoading(false);
            setError('Le mot de passe doit contenir entre 8 et 30 caractères');
            return;
        }

        if (password !== confirmPassword) {
            setLoading(false);
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        try {
            const api = process.env.API_BASE_URL;
            const url = api + '/api/auth/reset-password/' + token;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/ld+json",
                },
                body: JSON.stringify({ password: password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Une erreur est survenue');
            }

            setStatus('success');
        } catch (err) {
            if(err.message.includes('expiré')) {
                setError('Le lien est expiré');
            } else if (err.message.includes('utilisé')) {
                setError('Le lien a déjà été utilisé');
            }
            else {
                setError('Une erreur est survenue');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">
            <div className="bg-white p-8 rounded-lg shadow-md text-center md:min-w-[40rem]">
                {status === 'loading' && <Loading/>}
                {(status === 'input' || status === 'error') && (
                    <>
                        <h1 className='text-lg font-semibold'>Réinitialisation du mot de passe</h1>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="password" className="text-left w-full">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    placeholder="Nouveau mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="confirmPassword" className="text-left w-full">Confirmer mot de passe</label>
                                <input
                                    type="password"
                                    placeholder="Confirmer mot de passe"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <Button
                                variant={'default'}
                                size={'lg'}
                                type="submit"
                                className="mt-4"
                                disabled={loading}
                            >
                                Réinitialiser le mot de passe
                            </Button>
                        </form>
                    </>
                )}
                { status === 'success' && (
                    <div className='flex flex-col gap-6'>
                        <div className="flex flex-col items-center justify-center gap-2 mb-4">
                            <CheckCircleIcon className="text-green-500 w-16 h-16"/>
                            <p className="">Votre mot de passe a été réinitialisé avec succès.</p>
                        </div>
                        <Link href="/login">
                            <Button
                                    variant={'default'}
                                    size={'lg'}
                                >
                                Se connecter
                            </Button>
                        </Link>
                    </div> 
                )}
            </div>
        </div>
    );
}
