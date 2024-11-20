import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { k2d } from '@/app/fonts/fonts';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
    return (
        <footer className="bg-darkColor text-background px-4 justify-items-center relative overflow-hidden z-0">
            <div className='flex flex-col md:flex-row items-center justify-between max-w-7xl w-full py-7'>
                <Link href="/" className="flex items-center gap-3 text-xl font-bold mb-6 md:mb-0">
                    <Image 
                        src="/images/logo_eventify.webp"
                        alt='Eventify Logo'
                        width={100}
                        height={100}
                        className='shrink-0 w-8 h-8'
                    />
                    <span className={`${k2d.className}`}>Eventify</span>
                </Link>

                <ul className='flex flex-col md:flex-row items-center gap-3 opacity-75 text-base md:gap-5'>
                    <li>
                        <Link href="/mentions-legales">Mentions légales</Link>
                    </li>
                    <li>
                        <Link href="/conditions-utilisation">Conditions d'utilisation</Link>
                    </li>
                    <li>
                        <Link href="/politique-confidentialite">Politique de confidentialité</Link>
                    </li>
                </ul>
            </div>
            <Separator className='opacity-40 max-w-7xl' />
            
            <div className='py-7 max-w-7xl w-full'>
                <p className='text-center md:text-end'>© 2024 Eventify. Tous droits réservés</p>
            </div>

            <div className="w-96 h-96 bg-primary rounded-full blur-3xl absolute -left-52 -bottom-64 -z-10" />
        </footer>
    );
};

export default Footer;