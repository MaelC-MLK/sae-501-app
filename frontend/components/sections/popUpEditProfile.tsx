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
import {UpdateUserImage} from "@/lib/actions";
import { UpdateUser } from "@/lib/actions";

export function PopUpEditProfile({ user, onUpdate, userContext : { userContextUser, setUser } }) {
  const [firstName, setfirstName] = useState(user?.firstName || "");
  const [lastName, setlastName] = useState(user?.lastName || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const [open, setOpen] = useState(false); 
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setfirstName(user.firstName || "");
      setlastName(user.lastName || "");
    }
  }, [user]);

  const validateNoNumbersOrSpecialChars = (str: string) => {
      const noNumbersOrSpecialCharsRegex = /^[a-zA-Z\sÀ-ÖØ-öø-ÿ-]+$/;
      return noNumbersOrSpecialCharsRegex.test(str);
  };

  const handleSubmit = async () => {
    try {
      if (!user || !user.id) {
        throw new Error("Utilisateur non défini ou ID manquant");
      }

      if (!validateNoNumbersOrSpecialChars(firstName)) {
          setError('Le prénom doit contenir uniquement des lettres ou - ');
          return;
      }

      if (!validateNoNumbersOrSpecialChars(lastName)) {
          setError('Le nom doit contenir uniquement des lettres ou - ');
          return;
      }
  
      var updatedUser = {
        "@context": "string", // Remplace par le bon contexte
        "@id": `${process.env.API_BASE_URL}/api/users/${user.id}`,
        "@type": "string",
        "id": user.id,
        "firstName": firstName,
        "lastName": lastName,
      };
  
      if (profilePicture) {
        const imageFile = new FormData();
        imageFile.append("imageFile", profilePicture);
        await UpdateUserImage(user, imageFile);
      }
      
      const data = await UpdateUser(updatedUser);
  
  
      
      if (onUpdate) {
        console.log(data);
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
        <Button variant="outline">Modifier le profil</Button>
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
            <Label htmlFor="firstName" className="text-right">
              Prénom
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setfirstName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Nom
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setlastName(e.target.value)}
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
