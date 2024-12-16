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
import { PopupJoinPublicEventProps } from "@/types/event";
import Link from "next/link";

export function PopupJoinPublicEvent({ eventId }: PopupJoinPublicEventProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {           
            await signUserInvite(email, eventId);
            setIsOpen(false);
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={'default'} className='w-full sm:w-auto'>S'inscrire</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Utiliser une adresse email</DialogTitle>
                    <DialogDescription>
                        Vous recevrez un email de confirmation pour valider votre inscription
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col">
                        <Label htmlFor="email" className="mb-2">
                            Email
                        </Label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                id="email"
                                placeholder="Entrez votre email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        variant={'default'} 
                        type="button" 
                        onClick={handleSubmit} 
                        disabled={loading}
                    >
                        {loading ? 'En cours...' : "S&apos;inscrire"}
                    </Button>
                </DialogFooter>
                <div className="flex flex-row items-center justify-center gap-3 mt-4">
                    <Separator className="shrink" />
                    <span className="text">Ou</span>
                    <Separator className="shrink" />
                </div>
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
