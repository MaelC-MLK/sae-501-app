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
import { UpdateUserImage, UpdateUser } from "@/lib/actions";
import { PopUpEditPassword } from "@/components/sections/popUpEditPassword";
import { Separator } from "../ui/separator";

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
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // État du premier pop-up
  const [passwordOpen, setPasswordOpen] = useState(false); // État du second pop-up
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  const handlePasswordUpdate = () => {
    setPasswordOpen(false); // Ferme le pop-up après la mise à jour du mot de passe
  };

  const validateNoNumbersOrSpecialChars = (str: string) => {
    const regex = /^[a-zA-Z\sÀ-ÖØ-öø-ÿ-]+$/;
    return regex.test(str);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!user || !user.id) {
        throw new Error("Utilisateur non défini ou ID manquant");
      }

      if (!validateNoNumbersOrSpecialChars(firstName)) {
        setError("Le prénom doit contenir uniquement des lettres ou -");
        return;
      }

      if (!validateNoNumbersOrSpecialChars(lastName)) {
        setError("Le nom doit contenir uniquement des lettres ou -");
        return;
      }

      const updatedUser = {
        "@id": `${process.env.API_BASE_URL}/api/users/${user.id}`,
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
        onUpdate(data); // Met à jour dans le composant parent
        setUser(data); // Met à jour dans le contexte
      }

      setOpen(false); // Ferme le pop-up
    } catch (error: any) {
      setError(error.message || "Une erreur s'est produite lors de la mise à jour.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        setError("Veuillez sélectionner uniquement des fichiers JPG, PNG ou WEBP.");
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError("La taille du fichier ne doit pas dépasser 2MB.");
        return;
      }
      setProfilePicture(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile)); // Prévisualisation
      setError("");
    }
  };

  return (
    <>
      {/* Premier pop-up : Modifier le profil */}
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">
                Prénom :
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName" >
                Nom : 
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="profilePicture" >
                Photo de profil : 
              </Label>
              <Input
                type="file"
                id="profilePicture"
                onChange={handleFileChange}
                className=""
              />
            </div>
            {imagePreview && (
              <div className="col-span-3">
                <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full" />
              </div>
            )}

          </div>

          <DialogFooter className="sm:flex-col">
            <Button type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
          <div className="flex flex-row items-center justify-center gap-3 mt-2">
            <Separator className="shrink" />
          </div>
          <Button type="button" variant="secondary" className="w-full" onClick={() => setPasswordOpen(true)}>
            Modifier le mot de passe
          </Button>
        </DialogContent>
      </Dialog>

      {passwordOpen && <PopUpEditPassword user={user} userContext={{ userContextUser, setUser }} onPasswordUpdate={handlePasswordUpdate} />}
    </>
  );
}
