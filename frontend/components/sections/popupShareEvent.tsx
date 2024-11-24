import { Copy } from "lucide-react"
import { useState } from 'react';
import Image from "next/image";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    FacebookShareButton,
    FacebookIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
    EmailShareButton,
    EmailIcon,
} from 'next-share';

export function PopupShareEvent({ eventUrl }: { eventUrl: string }) {
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(eventUrl);
            setCopySuccess('Lien copié dans le presse-papiers.');
        } catch (err) {
            setCopySuccess('Échec de la copie du lien.');
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size={'icon'} className="">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
</svg>

                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Partager le lien</DialogTitle>
                    <DialogDescription>
                        Toute personne ayant ce lien pourra le consulter.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-row gap-2">
                    <FacebookShareButton
                        url={'https://github.com/next-share'}
                        quote={'Jetez un oeil à cet évènement !'}
                        hashtag={'#eventify'}
                    >
                        <FacebookIcon size={32} borderRadius={12} />
                    </FacebookShareButton>
                    <LinkedinShareButton url={'https://github.com/next-share'} >
                        <LinkedinIcon size={32} borderRadius={12} />
                    </LinkedinShareButton>
                    <TwitterShareButton
                        url={'https://github.com/next-share'}
                        title={'Jetez un oeil à cet évènement !'}
                    >
                        <TwitterIcon size={32} borderRadius={12} />
                    </TwitterShareButton>
                    <WhatsappShareButton
                        url={'https://github.com/next-share'}
                        title={'Jetez un oeil à cet évènement !'}
                        separator=":: "
                    >
                        <WhatsappIcon size={32} borderRadius={12} />
                    </WhatsappShareButton>
                    <FacebookMessengerShareButton
                        url={'https://github.com/next-share'}
                        appId={''}
                    >
                        <FacebookMessengerIcon size={32} borderRadius={12} />
                    </FacebookMessengerShareButton>
                    <EmailShareButton
                        url={'https://github.com/next-share'}
                        subject={'Eventify'}
                        body="Jetez un oeil à cet évènement !"
                    >
                        <EmailIcon size={32} borderRadius={12} />
                    </EmailShareButton>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={eventUrl}
                            readOnly
                        />
                    </div>
                    <Button type="submit" variant={'outline'} className="px-3" onClick={handleCopy}>
                        <span className="sr-only">Copier</span>
                        <Copy />
                    </Button>
                </div>
                {copySuccess && <p className="text-sm opacity-50">{copySuccess}</p>}
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Fermer
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
