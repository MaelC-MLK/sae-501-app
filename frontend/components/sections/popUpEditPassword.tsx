'use client';

import React, { useState } from "react";
import { UpdateUserPassword } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";


interface User {
  id: string;
}

interface UserContext {
  userContextUser: User | null;
  setUser: (user: User) => void;
}

interface PopUpEditPasswordProps {
  user: User;
  userContext: UserContext;
}

export function PopUpEditPassword({ user, userContext: { userContextUser, setUser } }: PopUpEditPasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true); // Gestion de l'ouverture du popup
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 30) {
      setError("Le mot de passe doit contenir entre 8 et 30 caractères.");
      return;
    }

    try {
      const res = await UpdateUserPassword(user.id, currentPassword, newPassword);
      if (res) {
        // Rediriger vers la page de login après la mise à jour du mot de passe en rechargeant la page
        window.location.href = "/login";
      } else {
        setError("Erreur lors de la mise à jour du mot de passe.");
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du mot de passe.");
    }
  };

  if (!isOpen) return null; // Si le popup est fermé, ne rien afficher

  return (
    <div className="popup bg-white p-4 rounded-lg shadow-lg">
      <Dialog open={isOpen} onOpenChange={setIsOpen}> {/* On utilise isOpen ici pour contrôler l'ouverture */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Modifier le mot de passe</DialogTitle>
          <DialogDescription>
            Cliquez sur "Mettre à jour" lorsque vous avez terminé.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword" >
                Mot de passe actuel :
              </Label>
              <Input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-row items-center justify-center gap-3 mt-2">
                    <Separator className="shrink" />
                </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword" >
                Nouveau mot de passe :
              </Label>
              <div className="relative w-full">
                <Input
                  type={showPassword ? "text" : "password"} // On affiche le mot de passe ou non selon l'état
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                >
                  <img
                    src={showPassword ? "/images/show.svg" : "/images/no-show.svg"}
                    alt="Toggle Password Visibility"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">
                Confirmer le nouveau mot de passe :
              </Label>
              <div className="relative w-full">
                <Input
                  type={showConfirmPassword ? "text" : "password"} // Affichage du mot de passe confirm
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle visibility
                >
                  <img
                    src={showConfirmPassword ? "/images/show.svg" : "/images/no-show.svg"}
                    alt="Toggle Confirm Password Visibility"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="submit">Mettre à jour</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
