"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { getUserFromToken } from '@/lib/utils';

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

interface NavItem {
    name: string;
    path: string;
    variant: ButtonVariant;
}

const Navbar = () => {

    let user = null;

    if(localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        user = getUserFromToken(token);
    }

    const navItems: NavItem[] = user ? [
        { name: 'Profile', path: '/profile', variant: 'default' },
        { name: 'Logout', path: '/logout', variant: 'outline' },
    ]
    : [
        { name: 'Sign in', path: '/login', variant: 'outline' },
        { name: 'Sign up', path: '/register', variant: 'default' },
    ]
    ;

    return (
        <div className="flex flex-row items-center justify-between bg-background h-16 px-4 border-b-2 w-full fixed z-50">
            <Link href="/" className="text-2xl font-bold">
                Event<span className='text-primary'>ify</span>
            </Link>
            <div className="flex flex-row gap-2">
                {user && <p className='text-primary'>Hello, {user.username}</p>}
                {navItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                        <Button variant={item.variant}>
                            {item.name}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Navbar;
