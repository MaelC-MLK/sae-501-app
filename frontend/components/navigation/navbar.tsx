"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { getUserFromToken } from '@/lib/utils';
import { k2d } from '@/app/fonts/fonts';
import Image from 'next/image';

const Navbar = () => {

    let user = null;

    if(localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        user = getUserFromToken(token);
    }

    return (
        <div className="flex flex-row items-center justify-between bg-background h-16 px-4 border-b-2 w-full fixed z-50">
            <Link href="/" className="text-2xl font-bold">
                <Image 
                    src="/images/logo_eventify.webp"
                    alt='Eventify Logo'
                    width={50}
                    height={50}
                ></Image>
                
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
        </div>
    );
};

export default Navbar;
