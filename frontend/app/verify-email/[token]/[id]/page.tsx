'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailPage({ params }: { params: { token: string, id: string } }) {
    const { token, id } = params;
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'alreadyVerified' | null>('loading');
    const [message, setMessage] = useState<string | null>(null);
    const hasFetched = useRef(false); // Référentiel pour suivre l'état de la requête

    useEffect(() => {
        if (hasFetched.current) return; // Si déjà fetché, ne rien faire
        hasFetched.current = true; // Marquer comme fetché

        const verifyToken = async () => {
            try {
                const res = await fetch(`${process.env.API_BASE_URL}/api/verify-email/${token}/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.message === 'Utilisateur déjà inscrit à l&apos;événement.') {
                        setStatus('alreadyVerified');
                        setMessage(data.message);
                    } else {
                        setStatus('success');
                        setMessage('Votre inscription a été validée avec succès !');
                    }
                } else {
                    const data = await res.json();
                    setStatus('error');
                    setMessage(data.error || 'Token invalide.');
                }
            } catch {
                setStatus('error');
                setMessage('Erreur lors de la vérification.');
            }
        };

        verifyToken();
    }, [token, id]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                {status === 'loading' && <h1>Vérification de l&apos;email...</h1>}
                {(status === 'success' || status === 'alreadyVerified' || status === 'error') && (
                    <>
                        <h1 className='text-lg font-semibold'>{message}</h1>
                        <Link href={'/'}>
                            <Button
                                variant={'default'}
                                size={'lg'}
                                className="mt-4"
                            >
                                Retour à l&apos;accueil
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}