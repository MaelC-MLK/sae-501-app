"use client";

import React from 'react';
import { k2d } from "@/app/fonts/fonts";
import Image from 'next/image';
import RegisterForm from '@/components/sections/registerForm';

export default function Page() {
    return (
        <div className="flex h-full">
            {/* Section Formulaire */}
            <div className="flex flex-col justify-items-center md:w-2/3 p-4 pt-16 sm:pt-24 mx-auto lg:mx-0 lg:px-34">
                <h1 className={`${k2d.className} text-3xl font-bold mb-6`}>Rejoignez notre communauté</h1>

                {/* Composant RegisterForm */}
                <RegisterForm />

                <p className="text-center text-sm text-gray-500 mt-2">
                    Vous avez déjà un compte ?{' '}
                    <a href="/login" className="text-primary hover:underline">
                        Connectez-vous
                    </a>
                </p>
            </div>

            {/* Section Image */}
            <div className="hidden overflow-y-auto lg:block lg:right-0 lg:fixed lg:h-full lg:inset-0 lg:left-auto lg:w-1/3 z-0">
                <Image
                    src="/images/register-picture.png"
                    alt="Photo"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
        </div>
    );
}
