"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Custom500 = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className='text-2xl font-bold'>Oups...</h2>
            <h1 className="text-[16rem] font-bold mb-4 text-primary leading-none">500</h1>
            <p className='text-2xl font-semibold mb-8'>Erreur interne du serveur</p>
            <p className="mb-4">Désolé, une erreur est survenue sur le serveur.</p>
            <Link href={"/"}>
                <Button variant={"default"} size={"lg"}>
                    Retour à l&apos;accueil
                </Button>
            </Link>
        </div>
    );
};

export default Custom500;