import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Page () {



    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Registration Successful!</h1>
            <p>Thank you for registering. Your account has been successfully created.</p>

            <Link href="/">
                <Button>
                                Return to Home
                </Button>
            </Link>
           
        </div>
    );
};
