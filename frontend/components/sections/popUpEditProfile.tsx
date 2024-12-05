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
import { UpdateUserImage } from "@/lib/actions";
import { UpdateUser } from "@/lib/actions";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface UserContext {
  userContextUser: User | null;
  setUser: (user: User) => void;
}

interface PopUpEditProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  userContext: UserContext;
}

export function PopUpEditProfile({ user, onUpdate, userContext: { userContextUser, setUser } }: PopUpEditProfileProps) {
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
      if (!user || !user.id) {
        throw new Error("Utilisateur non défini ou ID manquant");
      }

      var updatedUser = {
        "@context": "string", // Remplace par le bon contexte
        "@id": `${process.env.API_BASE_URL}/api/users/${user.id}`,
        "@type": "string",
        "id": user.id,
        "firstName": name,
        "lastName": username,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        setError('Veuillez sélectionner uniquement des fichiers JPG, PNG ou WEBP.');
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('La taille du fichier ne doit pas dépasser 2MB.');
        return;
      }
      setProfilePicture(selectedFile);
      setError('');
    } else {
      setError('Veuillez sélectionner uniquement des fichiers JPG, PNG ou WEBP.');
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
            <Label htmlFor="name" className="text-right">
              Prénom
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
              Nom
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
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={!!error}>
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}