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
import Image from 'next/image';

export function PopUpEditProfile({ user, onUpdate, userContext : { userContextUser, setUser } }) {
  const [name, setName] = useState(user?.firstName || "");
  const [username, setUsername] = useState(user?.lastName || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [open, setOpen] = useState(false); 
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.firstName || "");
      setUsername(user.lastName || "");
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      const api = "http://localhost:8080";
      const url = `${api}/api/users/${user.id}`;

      const updatedUser = {
        "@context": "string", // Remplace par le bon contexte
        "@id": `http://localhost:8080/api/users/${user.id}`,
        "@type": "string",
        "id": user.id,
        "firstName": name,
        "lastName": username,
      };

      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify(updatedUser),
      });


      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Vous n'êtes pas autorisé à effectuer cette action");
        }
        if (response.status === 404) {
          throw new Error("Utilisateur non trouvé");
        }
        if (response.status === 422) {
          throw new Error("Contenu non valide");
        }

        throw new Error("Erreur lors de la mise à jour du profil");
      }

      const data = await response.json();
      if (onUpdate) {
        onUpdate(data); // Appelle le callback pour mettre à jour le parent
        setUser(data); // Met à jour le contexte utilisateur
      }

      setOpen(false); // Ferme le pop-up après la mise à jour

    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-2.5">
          <Image src="/images/edit.svg" alt="Edit Icon" width={21} height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>
            Apportez des modifications à votre profil ici. Cliquez sur enregistrer lorsque vous avez terminé.
          </DialogDescription>
        </DialogHeader>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Prénom
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profilePicture" className="text-right">
              Photo de profil
            </Label>
            <Input
              type="file"
              id="profilePicture"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setProfilePicture(e.target.files[0]);
                }
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
