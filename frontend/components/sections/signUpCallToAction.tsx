import * as React from "react"
import Image from 'next/image'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { k2d } from"@/app/fonts/fonts";

export function SignUpCallToAction() {
    return (
        <div className="relative flex flex-row justify-start bg-primary text-primary-foreground px-4 py-10 sm:py-20 overflow-hidden mt-14 max-w-7xl justify-self-center w-full lg:rounded-2xl lg:px-16">
            <div className="z-20 flex flex-col gap-6 sm:gap-10 w-2/3 sm:w-3/5">
                <h3 className={`${k2d.className} text-3xl font-medium tracking-wide`}>Connectez-vous ou créez un compte pour <br />profiter de toutes les fonctionnalités !</h3>
                <Link href="/register">
                    <Button variant={'secondary'} size={'lg'}>Créer un compte</Button>
                </Link>
            </div>
            <Image
                src="/images/calendrier_illustration.webp"
                alt="calandar-image"
                width={700}
                height={700}
                objectFit="cover"
                className="z-10 absolute -rotate-6 -right-96 xl:-right-36 xl:top-16 rounded-xl shadow-primary-foreground shadow-cta-custom"
            />
        </div>
    )
}