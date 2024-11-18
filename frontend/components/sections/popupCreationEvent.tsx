"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { CalendarIcon } from "@radix-ui/react-icons"
import { ClockIcon } from "@radix-ui/react-icons"
import { CrossCircledIcon } from "@radix-ui/react-icons"

import { addDays, format, set } from "date-fns"
import { DateRange } from "react-day-picker"
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import UserSearchSkeleton from "@/components/skeletons/skeletons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createEvent } from "@/lib/actions";
import { PopupCreationEventProps } from "@/types/event";
import { fr } from 'date-fns/locale';
import ImageUpload from "@/components/sections/dropZoneEventPopup";
import { getUserIdFromToken } from "@/lib/utils";

const FormSchema = z.object({
    title: z.string().nonempty("Title is required"),
    description: z.string().optional(),
    location: z.string().optional(),
    date_start: z.string(),
    date_end: z.string(),
    time_start: z.string().nonempty("Start time is required"),
    time_end: z.string().nonempty("End time is required"),
    users: z.array(z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        avatar: z.string().optional(),
    })),
    isVisible: z.boolean(),
    is_draft: z.boolean(),
});

export default function PopupCreationEvent({ className }: PopupCreationEventProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: undefined,
    });
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPrivate, setIsPrivate] = useState<boolean>(true);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isMainDialogOpen, setIsMainDialogOpen] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            date_start: new Date().toISOString().replace("T", " ").substring(0, 19),
            date_end: new Date().toISOString().replace("T", " ").substring(0, 19),
            time_start: "",
            time_end: "",
            users: [],
            isVisible: false,
            is_draft: false,
        },
    });

    const combineDateAndTime = (date: Date, time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        const combinedDate = new Date(date);
        combinedDate.setHours(hours);
        combinedDate.setMinutes(minutes);
        combinedDate.setSeconds(0);
        combinedDate.setMilliseconds(0);

        // Ajuster pour le fuseau horaire local
        const timezoneOffset = combinedDate.getTimezoneOffset() * 60000;
        const localDate = new Date(combinedDate.getTime() - timezoneOffset);

        return localDate.toISOString().replace("T", " ").substring(0, 19);
    };

    const areAllFieldsFilled = () => {
        const values = form.getValues();
        return values.title && values.date_start && values.date_end && values.time_start && values.time_end;
    };

    useEffect(() => {
        const now = new Date();
        const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
        now.setMinutes(roundedMinutes);
        now.setSeconds(0);
        now.setMilliseconds(0);

        const startHour = now.getHours().toString().padStart(2, "0");
        const startMinute = now.getMinutes().toString().padStart(2, "0");
        const startTimeValue = `${startHour}:${startMinute}`;
        setStartTime(startTimeValue);
        form.setValue("time_start", startTimeValue);

        const end = new Date(now.getTime() + 60 * 60 * 1000);
        const endHour = end.getHours().toString().padStart(2, "0");
        const endMinute = end.getMinutes().toString().padStart(2, "0");
        const endTimeValue = `${endHour}:${endMinute}`;
        setEndTime(endTimeValue);
        form.setValue("time_end", endTimeValue);
    }, []);

    const handleSelect = (selectedDate: DateRange | undefined) => {
        if (!selectedDate?.from) {
            setDate({
                from: new Date(),
                to: undefined,
            });
        } else {
            setDate(selectedDate);
        }
    };

    const handleStartTimeChange = (value: string) => {
        setStartTime(value);
    };

    const handleEndTimeChange = (value: string) => {
        setEndTime(value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        setIsPopoverOpen(value.length > 0);
        setIsLoading(true);

        // Simulate search results with a timeout
        setTimeout(() => {
            const allUsers = [
                { id: 1, name: "John Doe", email: "john.doe@example.com", avatar: "https://via.placeholder.com/150" },
                { id: 2, name: "Jane Smith", email: "jane.smith@example.com", avatar: "https://via.placeholder.com/150" },
                { id: 3, name: "Alice Johnson", email: "jane.smith@example.com", avatar: "https://via.placeholder.com/150" },
                { id: 4, name: "Mael Cheron", email: "jane.smith@example.com", avatar: "https://via.placeholder.com/150" },
                { id: 5, name: "Tom Boutin", email: "jane.smith@example.com", avatar: "https://via.placeholder.com/150" },
                { id: 6, name: "Malek Fougasse", email: "jane.smith@example.com", avatar: "https://via.placeholder.com/150" },
                { id: 7, name: "Jane Smith", email: "jane.smith@example.com", avatar: "https://via.placeholder.com/150" },
            ];

            const filteredResults = allUsers.filter(user =>
                (user.name.toLowerCase().includes(value.toLowerCase()) ||
                    user.email.toLowerCase().includes(value.toLowerCase())) &&
                !participants.some(participant => participant.id === user.id)
            );

            setSearchResults(filteredResults);
            setIsLoading(false);
        }, 1000); // Simulate a 1 second delay for the search
    };

    const handleAddParticipant = (participant: any, event: React.MouseEvent) => {
        event.preventDefault();
        const updatedParticipants = [...participants, participant];
        setParticipants(updatedParticipants);
        form.setValue("users", updatedParticipants);
        setSearchTerm("");
        setSearchResults([]);
        setIsPopoverOpen(false);
    };

    const handleRemoveParticipant = (participantId: number) => {
        const updatedParticipants = participants.filter(participant => participant.id !== participantId);
        setParticipants(updatedParticipants);
        form.setValue("users", updatedParticipants);
        handleSearchChange({ target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>);
    };

    const resetForm = () => {
        const now = new Date();
        const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
        now.setMinutes(roundedMinutes);
        now.setSeconds(0);
        now.setMilliseconds(0);

        const startHour = now.getHours().toString().padStart(2, "0");
        const startMinute = now.getMinutes().toString().padStart(2, "0");
        const startTimeValue = `${startHour}:${startMinute}`;
        setStartTime(startTimeValue);

        const end = new Date(now.getTime() + 60 * 60 * 1000);
        const endHour = end.getHours().toString().padStart(2, "0");
        const endMinute = end.getMinutes().toString().padStart(2, "0");
        const endTimeValue = `${endHour}:${endMinute}`;
        setEndTime(endTimeValue);

        setDate({ from: new Date(), to: undefined });

        form.reset({
            title: undefined,
            description: undefined,
            location: undefined,
            date_start: new Date().toISOString().replace("T", " ").substring(0, 19),
            date_end: new Date().toISOString().replace("T", " ").substring(0, 19),
            time_start: startTimeValue,
            time_end: endTimeValue,
            users: [],
            isVisible: false,
            is_draft: false,
        });

        setParticipants([]);
        setImageFile(null);
        setIsPrivate(true);
    };

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description || "");
        formData.append('date_start', combineDateAndTime(date?.from || new Date(), data.time_start).toString());
        formData.append('date_end', combineDateAndTime(date?.to || date?.from || new Date(), data.time_end).toString());
        formData.append('users', JSON.stringify(participants));
        formData.append('isVisible', isPrivate ? "false" : "true");
        formData.append('is_draft', "false");
        formData.append('location', data.location || "");
        formData.append('creator', `/api/users/${getUserIdFromToken()}`);

        
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }

        
        try {
            const response = await createEvent(formData);
            console.log("Event created successfully:", response);
            setIsMainDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to create event:", error);
        }
    };
    
    const saveDraft = async (data: z.infer<typeof FormSchema>) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description || "");
        formData.append('date_start', combineDateAndTime(date?.from || new Date(), data.time_start).toString());
        formData.append('date_end', combineDateAndTime(date?.to || date?.from || new Date(), data.time_end).toString());
        formData.append('users', JSON.stringify(participants));
        formData.append('isVisible', "false");
        formData.append('is_draft', "true");
        formData.append('location', data.location || "");
        formData.append('creator', `/api/users/${getUserIdFromToken()}`);

        
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
    
        try {
            const response = await createEvent(formData);
            console.log("Event saved as draft:", response);
            setIsConfirmDialogOpen(false);
            setIsMainDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to save draft:", error);
        }
    };

    return (
        <>
            <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
                <DialogTrigger asChild className={`${className}`}>
                    <Button onClick={() => setIsMainDialogOpen(true)}>Ajouter</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl max-h-dvh overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Créer un événement</DialogTitle>
                        <DialogDescription>
                            Veuillez remplir le formulaire.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="">
                                <div className="flex flex-col">
                                    <Label htmlFor="title" className="mb-2">
                                        Nom
                                    </Label>
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input id="title" placeholder="Nom de l'événement" autoComplete="off" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-5 mt-4">
                                    <div className="flex flex-col">
                                        <Label htmlFor="date" className="mb-2">
                                            Date
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "justify-start text-left font-normal capitalize",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date?.from ? (
                                                        date.to && date.from.getTime() !== date.to.getTime() ? (
                                                            `${format(date.from, "dd MMMM yyyy", { locale: fr })} - ${format(date.to, "dd MMMM yyyy", { locale: fr })}`
                                                        ) : (
                                                            format(date.from, "dd MMMM yyyy", { locale: fr })
                                                        )
                                                    ) : (
                                                        <span>Choisissez une date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    initialFocus
                                                    mode="range"
                                                    defaultMonth={date?.from}
                                                    selected={date}
                                                    onSelect={handleSelect}
                                                    numberOfMonths={2}
                                                    locale={fr}
                                                    weekStartsOn={1}
                                                    className="capitalize"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="flex gap-3 items-start">
                                        <FormField
                                            control={form.control}
                                            name="time_start"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Heure de début</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            value={startTime}
                                                            onValueChange={(value) => {
                                                                setStartTime(value);
                                                                field.onChange(value);
                                                            }}
                                                        >
                                                            <SelectTrigger className="font-normal focus:ring-0 w-[120px]">
                                                                <ClockIcon className="h-4 w-4" />
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <ScrollArea className="h-[15rem]">
                                                                    {Array.from({ length: 96 }).map((_, i) => {
                                                                        const hour = Math.floor(i / 4)
                                                                            .toString()
                                                                            .padStart(2, "0");
                                                                        const minute = ((i % 4) * 15)
                                                                            .toString()
                                                                            .padStart(2, "0");
                                                                        return (
                                                                            <SelectItem key={i} value={`${hour}:${minute}`}>
                                                                                {hour}:{minute}
                                                                            </SelectItem>
                                                                        );
                                                                    })}
                                                                </ScrollArea>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <span className="mt-6">à</span>

                                        <FormField
                                            control={form.control}
                                            name="time_end"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Heure de fin</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            value={endTime}
                                                            onValueChange={(value) => {
                                                                setEndTime(value);
                                                                field.onChange(value);
                                                            }}
                                                        >
                                                            <SelectTrigger className="font-normal focus:ring-0 w-[120px]">
                                                                <ClockIcon className="h-4 w-4" />
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <ScrollArea className="h-[15rem]">
                                                                    {Array.from({ length: 96 }).map((_, i) => {
                                                                        const hour = Math.floor(i / 4)
                                                                            .toString()
                                                                            .padStart(2, "0");
                                                                        const minute = ((i % 4) * 15)
                                                                            .toString()
                                                                            .padStart(2, "0");
                                                                        return (
                                                                            <SelectItem key={i} value={`${hour}:${minute}`}>
                                                                                {hour}:{minute}
                                                                            </SelectItem>
                                                                        );
                                                                    })}
                                                                </ScrollArea>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col mt-4">
                                    <Label htmlFor="location" className="mb-2">
                                        Localisation
                                    </Label>
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input id="location" placeholder="Localisation de l'événement" autoComplete="off" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col mt-4">
                                    <Label htmlFor="description" className="mb-2">
                                        Description
                                    </Label>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea id="description" autoComplete="off" placeholder="Description de l'événement" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                <div className="flex flex-col mt-4 sm:absolute sm:top-2 sm:right-14">
                                    <Label htmlFor="visibility" className="mb-2 sm:hidden">
                                        Visibilité
                                    </Label>
                                    <Tabs defaultValue={isPrivate ? "private" : "public"} onValueChange={(value) => setIsPrivate(value === "private")}>
                                        <TabsList>
                                            <TabsTrigger value="private">Private</TabsTrigger>
                                            <TabsTrigger value="public">Public</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>

                                <div className="flex flex-col mt-4">
    <Label htmlFor="image" className="mb-2">
        Ajouter une image
    </Label>
    <ImageUpload name="image" onFileSelect={(file) => setImageFile(file)} />
</div>

                                <Separator className="my-4" />

                                <div className="flex flex-col mt-4">
                                    <Label htmlFor="participants" className="mb-2">
                                        Ajouter des participants
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="participants"
                                            placeholder="Rechercher des participants"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className=""
                                            ref={searchInputRef}
                                            autoComplete="off"
                                        />
                                        {isPopoverOpen && (
                                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 bottom-12 ">
                                                <ScrollArea className="h-fit max-h-60 overflow-y-auto">
                                                    {isLoading ? (
                                                        <UserSearchSkeleton />
                                                    ) : (
                                                        searchResults.length > 0 ? (
                                                            searchResults.map((result) => (
                                                                <div
                                                                    key={result.id}
                                                                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                                                                    onClick={(event) => handleAddParticipant(result, event)}
                                                                >
                                                                    <Avatar className="mr-2">
                                                                        <AvatarImage src={result.avatar} alt={result.name} />
                                                                        <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span>{result.name}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-4 text-center text-gray-500">
                                                                Aucun résultats.
                                                            </div>
                                                        )
                                                    )}
                                                </ScrollArea>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap mt-4 gap-2 mb-2">
                                    {participants.map((participant) => (
                                        <div key={participant.id} className="relative">
                                            <Avatar className="">
                                                <AvatarImage src={participant.avatar} alt={participant.name} />
                                                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <CrossCircledIcon
                                                className="absolute -top-0.5 -right-0.5 h-4 w-4 text-black cursor-pointer bg-white rounded-full"
                                                onClick={() => handleRemoveParticipant(participant.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <DialogFooter className="gap-2 md:gap-0 mt-6 sm:mt-0">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (areAllFieldsFilled()) {
                                                setIsConfirmDialogOpen(true);
                                            } else {
                                                setIsMainDialogOpen(false); // Fermer le popup de création d'événement
                                                form.reset({
                                                    title: "",
                                                    description: "",
                                                    date_start: new Date().toISOString().replace("T", " ").substring(0, 19),
                                                    date_end: new Date().toISOString().replace("T", " ").substring(0, 19),
                                                    time_start: startTime,
                                                    time_end: endTime,
                                                    users: [],
                                                    isVisible: false,
                                                    is_draft: false,
                                                });
                                                setIsPrivate(true);
                                            }

                                        }}
                                    >
                                        Annuler
                                    </Button>
                                </DialogClose>
                                <Button type="submit">Créer</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enregistrer en brouillon ?</DialogTitle>
                        <DialogDescription>
                            Voulez-vous enregistrer cet événement en tant que brouillon ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsConfirmDialogOpen(false);
                                setIsMainDialogOpen(false); // Fermer le popup de création d'événement
                                form.reset({
                                    title: "",
                                    description: "",
                                    date_start: new Date().toISOString().replace("T", " ").substring(0, 19),
                                    date_end: new Date().toISOString().replace("T", " ").substring(0, 19),
                                    time_start: startTime,
                                    time_end: endTime,
                                    users: [],
                                    isVisible: false,
                                    is_draft: false,
                                });
                                setIsPrivate(true);
                            }}
                        >
                            Non
                        </Button>
                        <Button
                            onClick={async () => {
                                const data = form.getValues();
                                await saveDraft(data);

                            }}
                        >
                            Oui
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}