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

export function PopupJoinPublicEvent() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'default'} size={'lg'} className='w-full sm:w-auto'>S'inscrire</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>S'inscrire avec une adresse email</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col">
                        <Label htmlFor="name" className="mb-2">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="Entrez votre email..."
                            className="col-span-3"
                        />
                    </div>

                </div>
                <DialogFooter>
                    <Button variant={'default'} type="submit">S'inscrire</Button>
                </DialogFooter>
                <DialogHeader>
                    <DialogTitle>Créer un compte</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="w-full flex flex-row gap-3">
                        <Button size={'lg'} variant={'default'} className="w-full">
                            S'inscrire
                        </Button>
                        <Button size={'lg'} variant={'outline'} className="w-full">
                            S'inscrire
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
