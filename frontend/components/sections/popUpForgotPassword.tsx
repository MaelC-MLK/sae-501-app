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

export default function PopUpForgotPassword() {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        if (!validateEmail(email)) {
            setError('Entrez une adresse email valide');
            setSuccess(false);
            setLoading(false);
            return;
        }

        try {         
            const api = process.env.API_BASE_URL;
            const url = `${api}/api/auth/forgot-password`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message);
            }

            setSuccess(true);

        } catch (err: unknown) {
            setSuccess(false);
            if(err instanceof Error) {
                if(err.message.includes("Username could not be found.")) {
                    setError("Aucun compte n'a été trouvé avec cet email");
                }
            }
            else {
                setError("une erreur est survenue");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="text-primary hover:underline text-sm mb-2">Mot de passe oublié ?</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Vous avez oublié votre mot de passe ?</DialogTitle>
                    <DialogDescription>
                       {success ? (<p className="text-green-500">Un email vous a été envoyé avec les instructions pour réinitialiser votre mot de passe.</p>) : (<p>Entrez votre adresse email pour réinitialiser votre mot de passe.</p>)}
                       {error && <p className="text-red-500 text-sm">{error}</p>}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-1">
                    <div className="flex flex-col gap-2">
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
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        variant={'default'} 
                        type="button" 
                        onClick={handleSubmit} 
                        disabled={loading}
                    >
                        {loading ? 'En cours...' : "Envoyer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
