"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className='text-2xl font-bold'>Oups...</h2>
      <h1 className="text-[16rem] font-bold mb-4 text-primary leading-none">404</h1>
      <p className='text-2xl font-semibold mb-8'>Page non trouvée</p>
      <p className="mb-4">Désolé, la page que vous recherchez n'existe pas.</p>
      <Link href={"/"}>
        <Button variant={"default"} size={"lg"}>
          Retour à l'accueil
        </Button>
      </Link>
    </div>
  );
};

export default Custom404;