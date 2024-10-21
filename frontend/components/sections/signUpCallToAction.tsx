import * as React from "react"
import Image from 'next/image'

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SignUpCallToAction() {
    return (
        <div className="relative flex flex-row justify-start bg-primary/20 p-4 sm:p-24 overflow-hidden">
            <div className="z-10 flex flex-col gap-6 sm:gap-10 w-3/4 md:w-1/2 xl:w-1/3">
                <h2 className="text-2xl md:text-4xl font-bold tracking-wide leading-snug">Connectez-vous pour profitez de toutes les fonctionnalités !</h2>
                <Link href="/register">
                    <Button variant={'default'} size={'xl'}>Créer un compte</Button>
                </Link>
            </div>
            <Image
                src="/images/calendarDesktop.png"
                alt="calandar-image"
                width={600}
                height={600}
                objectFit="cover"
                className="z-0 absolute -rotate-12 -right-80 lg:-right-32 lg:top-20 drop-shadow-[0_10px_35px_rgba(0,0,0,0.25)]"
            />
        </div>
    )
}