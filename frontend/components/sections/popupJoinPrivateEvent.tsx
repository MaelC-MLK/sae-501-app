import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "../ui/separator";
import { signUserInvite } from "@/lib/actions";
import Link from "next/link";

export function PopupJoinPrivateEvent({ }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={'default'} className='w-full sm:w-auto'>S'inscrire</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Utiliser un compte utilisateur</DialogTitle>
                    <DialogDescription>
                        Connectez-vous ou créez un compte pour vous inscrire à cet événement
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="w-full flex flex-row gap-3">
                        <Link href={"/login"} className="w-full">
                            <Button size={'lg'} variant={'outline'} className="w-full">
                                Se connecter
                            </Button>
                        </Link>
                        <Link href={"/register"} className="w-full">
                            <Button size={'lg'} variant={'default'} className="w-full">
                                Créer un compte
                            </Button>
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
