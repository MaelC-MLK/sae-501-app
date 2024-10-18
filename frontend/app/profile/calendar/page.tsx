"use client"

import * as React from "react"
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
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

import { CalendarIcon } from "@radix-ui/react-icons"
import { ClockIcon } from "@radix-ui/react-icons"

import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
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

  const FormSchema = z.object({
    datetime: z.date({
      required_error: "Date & time is required!.",
    }),
  });

export default function Page() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: undefined,
    })
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [participants, setParticipants] = useState<any[]>([]);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
      });

    useEffect(() => {
        const now = new Date();
        const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
        now.setMinutes(roundedMinutes);
        now.setSeconds(0);
        now.setMilliseconds(0);

        const startHour = now.getHours().toString().padStart(2, "0");
        const startMinute = now.getMinutes().toString().padStart(2, "0");
        setStartTime(`${startHour}:${startMinute}`);

        const end = new Date(now.getTime() + 60 * 60 * 1000);
        const endHour = end.getHours().toString().padStart(2, "0");
        const endMinute = end.getMinutes().toString().padStart(2, "0");
        setEndTime(`${endHour}:${endMinute}`);
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
        setSearchTerm(event.target.value);
        // Simulate search results
        setSearchResults([
            { id: 1, name: "John Doe", avatar: "https://via.placeholder.com/150" },
            { id: 2, name: "Jane Smith", avatar: "https://via.placeholder.com/150" },
        ]);
    };

    const handleAddParticipant = (participant: any) => {
        setParticipants([...participants, participant]);
        setSearchTerm("");
        setSearchResults([]);
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Add +</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Create Event</DialogTitle>
                        <DialogDescription>
                            Fill in the form below to create a new event.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <div className="">
                            <div className="flex flex-col">
                                <Label htmlFor="name" className="mb-2">
                                    Name
                                </Label>
                                <Input id="name" placeholder="Event Name" className="" />
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
                                                    "justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date?.from ? (
                                                    date.to && date.from.getTime() !== date.to.getTime() ? (
                                                        `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                                                    ) : (
                                                        format(date.from, "LLL dd, y")
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
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
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="flex gap-3 items-end">
                                    <FormField
                                        control={form.control}
                                        name="datetime"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start Time</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={startTime}
                                                        onValueChange={handleStartTimeChange}
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

                                    <span className="mb-2">to</span>

                                    <FormField
                                        control={form.control}
                                        name="datetime"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>End Time</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={endTime}
                                                        onValueChange={handleEndTimeChange}
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
                                <Label htmlFor="description" className="mb-2">
                                    Description
                                </Label>
                                <Textarea id="description" placeholder="Description of your event" />
                            </div>
                            <Separator className="my-4" />

                            <div className="flex flex-col mt-4">
                                <Label htmlFor="participants" className="mb-2">
                                    Add Participants
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div>
                                            <Input
                                                id="participants"
                                                placeholder="Search for participants"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                className=""
                                            />
                                        </div>
                                    </PopoverTrigger>
                                    {searchResults.length > 0 && (
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <ScrollArea className="h-[15rem]">
                                                {searchResults.map((result) => (
                                                    <div
                                                        key={result.id}
                                                        className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                                                        onClick={() => handleAddParticipant(result)}
                                                    >
                                                        <Avatar className="mr-2">
                                                            <AvatarImage src={result.avatar} alt={result.name} />
                                                            <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span>{result.name}</span>
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </PopoverContent>
                                    )}
                                </Popover>
                            </div>

                            <div className="flex flex-wrap mt-4">
                                {participants.map((participant) => (
                                    <Avatar key={participant.id} className="mr-2 mb-2">
                                        <AvatarImage src={participant.avatar} alt={participant.name} />
                                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}