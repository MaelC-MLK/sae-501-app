"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useUser } from '@/contexts/UserProvider';
import Image from 'next/image';

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

interface NavItem {
    name: string;
    path: string;
    variant: ButtonVariant;
}

const Navbar = () => {
    const { user, setUser } = useUser();

    const navItems: NavItem[] = user ? [
        { name: 'Profil', path: '/profile', variant: 'default' },
        { name: 'Déconnexion', path: '/logout', variant: 'outline' },
    ]
    : [
        { name: 'Se connecter', path: '/login', variant: 'outline' },
        { name: 'Créer un compte', path: '/register', variant: 'default' },
    ]
    ;

    return (
        <div className="flex flex-row items-center justify-between bg-background h-16 px-4 border-b-2 w-full fixed z-50">
            <Link href="/" className="text-2xl font-bold">
                Event<span className='text-primary'>ify</span>
            </Link>
            <div className="flex flex-row gap-2">
                {user && <Link href="/profile" className="w-4 h-4 rounded-full"><Image src={"http://localhost:8080/uploads/users/"+user.avatar} alt="Profile" layout="fit" className="rounded-full w-4 h-4 "
          objectFit="cover" unoptimized="true"/></Link>}
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
