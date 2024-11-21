"use client";

import React from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ClockIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import UserSearchSkeleton from "@/components/skeletons/skeletons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdateEvent } from "@/lib/actions";
import { Separator } from "@/components/ui/separator";
import { fetchUserBy } from "@/lib/data";
import { PopupUpdateEventProps } from "@/types/event";
import { fr } from "date-fns/locale";
import { getUserIdFromToken } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";

const FormSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  date_start: z.string(),
  date_end: z.string(),
  time_start: z.string().nonempty("Start time is required"),
  time_end: z.string().nonempty("End time is required"),
  users: z.array(
    z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      avatar: z.string().optional(),
    })
  ),
  isVisible: z.boolean(),
  is_draft: z.boolean(),
});

export default function PopupUpdateEvent({
  eventData,
  className,
}: PopupUpdateEventProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(eventData.start),
    to: new Date(eventData.end),
  });
  const [startTime, setStartTime] = useState<string>(
    format(new Date(eventData.start), "HH:mm")
  );
  const [endTime, setEndTime] = useState<string>(
    format(new Date(eventData.end), "HH:mm")
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>(
    eventData.extendedProps.users.map((user: any) => ({
      id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      avatar: user.avatar,
    })) || []
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(
    !eventData.extendedProps.isVisible
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMainDialogOpen, setIsMainDialogOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: eventData.title,
      description: eventData.extendedProps.description,
      location: eventData.extendedProps.location,
      date_start: eventData.extendedProps.date_start,
      date_end: eventData.extendedProps.date_end,
      time_start: startTime,
      time_end: endTime,
      users:
        eventData.extendedProps.users.map((user: any) => ({
          id: user.id,
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          avatar: user.avatar,
        })) || [],
      isVisible: eventData.extendedProps.isVisible,
      is_draft: eventData.extendedProps.is_draft,
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
    return (
      values.title &&
      values.date_start &&
      values.date_end &&
      values.time_start &&
      values.time_end
    );
  };

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

  const handleSearchChange = useDebouncedCallback(async (value: string) => {
    if (value.length > 0) {
      try {
        const results = await fetchUserBy(value);
        const filteredResults = results.filter(
          (user: any) =>
            !participants.some((participant) => participant.id === user.id)
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, 300); // 300ms delay

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setIsPopoverOpen(value.length > 0);
    setIsLoading(true);
    handleSearchChange(value);
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
    const updatedParticipants = participants.filter(
      (participant) => participant.id !== participantId
    );
    setParticipants(updatedParticipants);
    form.setValue("users", updatedParticipants);
    handleSearchChange(searchTerm);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = {
      title: data.title,
      description: data.description || "",
      date_start: combineDateAndTime(
        date?.from || new Date(),
        data.time_start
      ).toString(),
      date_end: combineDateAndTime(
        date?.to || date?.from || new Date(),
        data.time_end
      ).toString(),
      isVisible: isPrivate ? "false" : "true",
      location: data.location || "",
      creator: `/api/users/${getUserIdFromToken()}`,
      users: participants.map((participant) => `/api/users/${participant.id}`),
    };  
  
    try {
      const response = await UpdateEvent(formData, eventData.id);
      setIsMainDialogOpen(false);
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  return (
    <>
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DialogTrigger asChild className={`${className}`}>
          <button
            className="relative group text-gray-500 hover:text-gray-700 px-1 float-right"
            onClick={() => setIsMainDialogOpen(true)}
          >
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
              Modifier l'événement
            </div>
            <div className="rounded-full p-2 group-hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="black"
                className="size-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl max-h-dvh overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier un événement</DialogTitle>
            <DialogDescription>
              Veuillez remplir le formulaire.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
          <form onSubmit={(e) => {e.preventDefault(); onSubmit(form.getValues())}}>
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
                          <Input
                            id="title"
                            placeholder="Nom de l'événement"
                            autoComplete="off"
                            {...field}
                          />
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
                            date.to &&
                            date.from.getTime() !== date.to.getTime() ? (
                              `${format(date.from, "dd MMMM yyyy", {
                                locale: fr,
                              })} - ${format(date.to, "dd MMMM yyyy", {
                                locale: fr,
                              })}`
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
                                      <SelectItem
                                        key={i}
                                        value={`${hour}:${minute}`}
                                      >
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
                                      <SelectItem
                                        key={i}
                                        value={`${hour}:${minute}`}
                                      >
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
                          <Input
                            id="location"
                            placeholder="Localisation de l'événement"
                            autoComplete="off"
                            {...field}
                          />
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
                          <Textarea
                            id="description"
                            autoComplete="off"
                            placeholder="Description de l'événement"
                            {...field}
                          />
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
                  <Tabs
                    defaultValue={isPrivate ? "private" : "public"}
                    onValueChange={(value) => setIsPrivate(value === "private")}
                  >
                    <TabsList>
                      <TabsTrigger value="private">Private</TabsTrigger>
                      <TabsTrigger value="public">Public</TabsTrigger>
                    </TabsList>
                  </Tabs>
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
                      onChange={handleInputChange}
                      className=""
                      ref={searchInputRef}
                      autoComplete="off"
                    />
                    {isPopoverOpen && (
                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 bottom-12 ">
                        <ScrollArea className="h-fit max-h-60 overflow-y-auto">
                          {isLoading ? (
                            <UserSearchSkeleton />
                          ) : searchResults.length > 0 ? (
                            searchResults.map((result) => (
                              <div
                                key={result.id}
                                className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                                onClick={(event) =>
                                  handleAddParticipant(result, event)
                                }
                              >
                                <Avatar className="mr-2">
                                  <AvatarImage
                                    src={result.avatar}
                                    alt={result.firstName}
                                  />
                                  <AvatarFallback>
                                    {result.firstName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="capitalize">
                                  {result.firstName} {result.lastName}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              Aucun résultats.
                            </div>
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
                        <AvatarImage
                          src={participant.avatar}
                          alt={participant.firstName}
                        />
                        <AvatarFallback>
                          {participant.firstName.charAt(0)}
                        </AvatarFallback>
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
                  >
                    Annuler
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                >
                  Modifier
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
