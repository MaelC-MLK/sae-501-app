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
import { inviteFriend } from "@/lib/actions";
import Image from "next/image";

export function PopUpJoinEventify() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            await inviteFriend(email);
            setIsOpen(false); // Ferme la pop-up si l'invitation est réussie
            setEmail(""); // Réinitialise le champ email
        } catch (err: unknown) {
            setError((err as Error).message || "Une erreur s&apos;est produite.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="flex gap-2 my-4 text-md w-full sm:w-auto text-primary hover:text-primary px-4">
                    Invitez vos amis
                    <Image src="/images/share-friends.png" alt="Share with friends" width={16} height={16} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Plus on est de fous, plus on rit !</DialogTitle>
                    <DialogDescription>
                        Un e-mail leur sera envoyé pour leur permettre de s&apos;inscrire rapidement.
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
                                placeholder="Entrez l'email de votre ami..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        {error && (
                            <p className="text-red-500 mt-2" role="alert">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="default"
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !email.trim()}
                    >
                        {loading ? "En cours..." : "Invitez un ami"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
