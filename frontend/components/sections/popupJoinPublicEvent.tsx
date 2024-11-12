import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "../ui/separator"

export function PopupJoinPublicEvent() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'default'} size={'lg'} className='w-full sm:w-auto'>S'inscrire</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Utiliser une adresse email</DialogTitle>
                    <DialogDescription>
                        Entrez votre adresse email pour vous inscrire à cet événement
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col">
                        <Label htmlFor="name" className="mb-2">
                            Email
                        </Label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                id="email"
                                placeholder="Entrez votre email..."
                                className="col-span-3"
                            />
                            <DialogFooter>
                                <Button variant={'default'} type="submit">S'inscrire</Button>
                            </DialogFooter>

                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-center gap-3">
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
                        <Button size={'lg'} variant={'outline'} className="w-full">
                            Se connecter
                        </Button>
                        <Button size={'lg'} variant={'default'} className="w-full">
                            Créer un compte
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
