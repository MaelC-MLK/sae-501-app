"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { getUserFromToken } from '@/lib/utils';
import { k2d } from '@/app/fonts/fonts';
import Image from 'next/image';

const Navbar = () => {

    let user = null;

    const token = localStorage.getItem('token');
    if (token) {
        user = getUserFromToken(token);
        console.log(user);
    }

    return (
        <div className="flex justify-center py-4 px-5 border-b-2 border-foreground/15 w-full fixed z-50 top-0 bg-background">
            <div className='flex items-center justify-between max-w-7xl w-full '>

            <Link href="/" className="flex items-center gap-3 text-xl font-bold">
                <Image 
                    src="/images/logo_eventify.webp"
                    alt='Eventify Logo'
                    width={100}
                    height={100}
                    className='shrink-0 w-8 h-8'

                ></Image>
                <span className={`${k2d.className}`}>Eventify</span>
            </Link>
            {/* <div className="flex flex-row gap-2">
                {user && <p className='text-primary'>Hello, {user.username}</p>}
                {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                        <Button variant={item.variant}>
                            {item.name}
                        </Button>
                    </Link>
                ))}
            </div> */}

                <div className="flex flex-row gap-4">
                    {user ? (
                        <>
                            <div className='flex items-center gap-4'>
                                <Link href="/profile/calendar">
                                    <Button variant="outline" className='p-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                    </svg>

                                    </Button>
                                </Link>

                            { /*{user.email} */
                                <Link href="/profile" className='flex items-center gap-4 group'>
                                    <Image
                                        src="/images/profile-picture.webp"
                                        alt='Profile Picture'
                                        width={50}
                                        height={50}
                                        quality={100}
                                        className='rounded-full group-hover:ring-2 group-hover:ring-primary transition-all shrink-0 w-10 h-10'
                                    >
                                    </Image>
                                    <p className='text-foreground capitalize truncate max-w-64 hidden sm:block'>{user.username}</p>
                                </Link>
                            }


                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/register">
                                <Button variant="secondary">S'inscrire</Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="default">Se connecter</Button>
                            </Link>
                        </>
                    )}
                </div>


            </div>

        </div>
    );
};

export default Navbar;
