"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

interface NavItem {
    name: string;
    path: string;
    variant: ButtonVariant;
}

const Navbar = () => {
    const navItems: NavItem[] = [
        { name: 'Sign in', path: '/login', variant: 'outline' },
        { name: 'Sign up', path: '/register', variant: 'default' },
    ];

    return (
        <div className="flex flex-row items-center justify-between bg-background h-16 px-4 border-b-2">
            <Link href="/" className="text-2xl font-bold">
                Event<span className='text-primary'>ify</span>
            </Link>
            <div className="flex flex-row gap-2">
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
