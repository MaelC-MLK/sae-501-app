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

export function PopUpDeleteUser({ user }) {
  const [open, setOpen] = useState(false); 

  const handleSubmit = async () => {
    try {
      const api = "http://localhost:8080";
      const url = `${api}/api/users/${user.id}`;

      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({id: user.sub}),
      });

      console.log("response", response);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      setOpen(false); // Ferme le pop-up après la mise à jour

      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");

      window.location.href = '/';

    } catch (error : any) {
      console.error("Erreur lors de la mise à jour :", error);
      alert(`Erreur : ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Supprimer le compte</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer le compte</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.	
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={handleSubmit}>
            Supprimer
          </Button>
          <Button type="button" variant="outline" onClick={() => {setOpen(false)}}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
