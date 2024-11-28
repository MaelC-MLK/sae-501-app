"use client";

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
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setDefaultResultOrder } from "dns";
import { useUser } from "@/contexts/UserProvider";
import Image from "next/image";

export function PopUpLogout() {
  const [open, setOpen] = useState(false); 
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async () => {
    try {
      const api = process.env.API_BASE_URL;
      const url = `${api}/api/auth/logout`;

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      setUser(null);
      setOpen(false); // Ferme le pop-up après la mise à jour

      router.push('/');

    } catch (error : any) {
      console.error("Erreur lors de la mise à jour :", error);
      alert(`Erreur : ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="px-">
          <Image src="/images/delete.svg" alt="Edit Icon" width={16} height={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Se déconnecter </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir vous déconneter de ce compte ? 
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={handleSubmit}>
            Se déconnecter
          </Button>
          <Button type="button" variant="outline" onClick={() => {setOpen(false)}}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
