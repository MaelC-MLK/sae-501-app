'use client';

import React from 'react';
import { k2d } from "@/app/fonts/fonts";
import LoginForm from '@/components/sections/loginForm';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="flex min-h-screen px-4 sm:px-0">
      <div className="flex flex-col justify-center w-full md:w-2/3 max-w-sm mx-auto mt-4 py-24">
        <h1 className={`${k2d.className} text-3xl font-bold mb-6`}>
          Heureux de vous revoir parmi nous !
        </h1>
        <LoginForm />
      </div>
      <div className='hidden md:block md:w-1/3 relative'>
        <Image src='/images/login-picture.png' alt='image connexion' fill style={{ objectFit: 'cover' }} />
      </div>
    </div>
  );
}
