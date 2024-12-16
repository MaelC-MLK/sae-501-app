"use client";

import React from "react";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { format, parse } from "date-fns";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdateEvent } from "@/lib/actions";
import { Separator } from "@/components/ui/separator";
import { fetchUserBy } from "@/lib/data";
import { PopupUpdateEventProps } from "@/types/event";
import { fr } from "date-fns/locale";
import { useUser } from "@/contexts/UserProvider";
import { useDebouncedCallback } from "use-debounce";
import { useToast } from "@/hooks/use-toast";
import { Participant } from "@/types/user";

interface SearchResult {
  id: string;
  name: string;
  // Add other properties of the search result object here
}

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
}

interface FormValues {
  title: string;
  description?: string;
  location?: string;
  date_start: string;
  date_end: string;
  time_start: string;
  time_end: string;
  users: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  }[];
  isVisible: boolean;
  is_draft: boolean;
  limit: string;
}

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
  limit: z.string(),
});

export default function PopupUpdateDraft({
  eventData,
  className,
  onEventChange,
}: PopupUpdateEventProps & { onEventChange: () => void }) {

  const dateStart = parse(eventData.date_start, "dd/MM/yyyy - HH:mm", new Date());
  const dateEnd = parse(eventData.date_end, "dd/MM/yyyy - HH:mm", new Date());

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(dateStart),
    to: new Date(dateEnd),
  });
  const [startTime, setStartTime] = useState<string>(
    format(new Date(dateStart), "HH:mm")
  );
  const [endTime, setEndTime] = useState<string>(
    format(new Date(dateEnd), "HH:mm")
  );
  const [searchTerm, setSearchTerm] = useState<string>("");  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [participants, setParticipants] = useState<Participant[]>(
    eventData.users.map((user: User) => ({
      id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      avatar: user.avatar,
    })) || []
  );
  // const [setIsPopoverOpen] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(
    !eventData.isVisible
  );
  const [isMainDialogOpen, setIsMainDialogOpen] = useState<boolean>(false);
  const userContext = useUser();
  const {toast} = useToast();



  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: eventData.title,
      description: eventData.description,
      location: eventData.location,
      date_start: eventData.date_start,
      date_end: eventData.date_end,
      time_start: startTime,
      time_end: endTime,
      users:
        eventData.users.map((user: User) => ({
          id: user.id,
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          avatar: user.avatar,
        })) || [],
      isVisible: eventData.isVisible,
      is_draft: eventData.is_draft,
      limit: eventData.limit,
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

  // const handleStartTimeChange = (value: string) => {
  //   setStartTime(value);
  // };

  // const handleEndTimeChange = (value: string) => {
  //   setEndTime(value);
  // };

  // const handleSearchChange = useDebouncedCallback(async (value: string) => {
  //   if (value.length > 0) {
  //     try {
  //       const results = await fetchUserBy(value);
  //       const filteredResults: SearchResult[] = results.filter(
  //         (user: User) =>
  //           !participants.some((participant: Participant) => participant.id === Number(user.id))
  //       );
  //       setSearchResults(filteredResults);
  //     } catch (error) {
  //       console.error("Failed to fetch search results:", error);
  //     }
  //   } else {
  //     setSearchResults([]);
  //   }
  // }, 300); // 300ms delay

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   setSearchTerm(value);
  //   // setIsPopoverOpen(value.length > 0);
  //   // setIsLoading(true);
  //   handleSearchChange(value);
  // };

  // const handleAddParticipant = (participant: any, event: React.MouseEvent) => {
  //   event.preventDefault();

  //   const limit = parseInt(form.getValues().limit, 10);

  //   if (participants.length >= limit) {
  //       toast({
  //           title: "Limite atteinte",
  //           description: "Le nombre maximum de participants a été atteint.",
  //       });
  //       return;
  //   }

  //   const updatedParticipants = [...participants, participant];
  //   setParticipants(updatedParticipants);
  //   form.setValue("users", updatedParticipants);
  //   setSearchTerm("");
  //   setSearchResults([]);
  //   // setIsPopoverOpen(false);
  // };

  // const handleRemoveParticipant = (participantId: number) => {
  //   const updatedParticipants = participants.filter(
  //     (participant) => participant.id !== participantId
  //   );
  //   setParticipants(updatedParticipants);
  //   form.setValue("users", updatedParticipants);
  //   handleSearchChange(searchTerm);
  // };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (userContext.user === null) {
      console.error("User not found");
      return;
    }
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
      isVisible: "false",
      location: data.location || "",
      creator: `/api/users/${userContext.user.id}`,
      users: participants.map((participant) => `/api/users/${participant.id}`),
      limit: data.limit.toString() || "100",
    };  
  
    try {
      await UpdateEvent(formData, eventData.id);
      setIsMainDialogOpen(false);
      onEventChange();
      toast({
        title: "Brouillon modifié ! ✅",
        description: "Votre événement a été modifié avec succès.",
      });
    } catch (error) {
      console.error("Failed to update event:", error);
      toast({
        title: "Erreur lors de la modification du brouillon ❌",
      });
    }
  };

  const handleRestoreEvent = async (data: z.infer<typeof FormSchema>) => {
    if (userContext.user === null) {
      console.error("User not found");
      return;
    }
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
      creator: `/api/users/${userContext.user.id}`,
      users: participants.map((participant) => `/api/users/${participant.id}`),
      is_draft: "false",
      limit: data.limit.toString() || "100",
    };  
  
    try {
      await UpdateEvent(formData, eventData.id);
      setIsMainDialogOpen(false);
      onEventChange();
      toast({
        title: "Brouillon restauré ! ✅",
        description: "Votre événement a été restauré avec succès.",
      });

    } catch (error) {
      console.error("Failed to update event:", error);
      toast({
        title: "Erreur lors de la restauration du brouillon ❌",
      });
    }
  }

  return (
    <>
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DialogTrigger asChild className={`${className}`}>
          <Button
            className="absolute bottom-1/2 sm:bottom-0 sm:top-1/2 -translate-y-1 sm:-translate-y-1/2 right-6 sm:right-20 z-30 px-1 float-right bg-background"
            onClick={() => setIsMainDialogOpen(true)}
            size="icon"
            variant="ghost"
          >
            <div className="p-2">
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
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl max-h-dvh overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le brouillon</DialogTitle>
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
                <div className="flex flex-col md:flex-row gap-5 mt-4">
                  <div className="flex flex-col w-full">
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

                <div className="grid md:grid-cols-2 gap-5 mt-4">
                  
                <div className="flex flex-col w-full">
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
                <div className="flex flex-col w-fit">
                  <Label htmlFor="limit" className="mb-2">
                    Limite de participants
                  </Label>
                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="limit"
                            type="number"
                            min={0}
                            max={100000}
                            placeholder="100"
                            autoComplete="off"
                            {...field}
                          />
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

                {/* <div className="flex flex-col mt-4">
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
                          // {isLoading ? (
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
                </div> */}

                {/* <div className="flex flex-wrap mt-4 gap-2 mb-2">
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
                </div> */}
              </div>
              <DialogFooter className="gap-2 md:gap-0 mt-6 sm:mt-0 sm:justify-between">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                  >
                    Annuler
                  </Button>
                </DialogClose>
                <div className='flex flex-col sm:flex-row gap-2'>
                <Button
                  type="submit"
                  disabled={!areAllFieldsFilled()}
                  variant="secondary"
                >
                  Modifier
                </Button>
                <Button
                  onClick={(e) => {e.preventDefault(); handleRestoreEvent(form.getValues())}}
                  >
                  Restaurer
                </Button>
                  </div>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
