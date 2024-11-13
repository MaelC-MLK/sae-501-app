import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-primary text-secondary p-4">
            <div className="flex flex-row justify-between mx-8 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Eventify. Tous droits réservés</p>
                <ul className='flex flex-row gap-8'>
                    <li>
                        <Link href="/">
                            Mentions légales
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            Conditions d'utilisation
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            Politique de confidentialité et de gestion des cookies
                        </Link></li>
                    <li>
                        <Link href="/">
                            Paramètres de confidentialité et de cookies
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;