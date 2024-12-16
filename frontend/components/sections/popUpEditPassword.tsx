import React, { useState } from "react";
import { UpdateUserPassword } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  onPasswordUpdate: () => void; // Callback pour fermer le pop-up
}

export function PopUpEditPassword({ user, userContext: { userContextUser, setUser }, onPasswordUpdate }: PopUpEditPasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true);

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
      await UpdateUserPassword(user.id, currentPassword, newPassword);
      onPasswordUpdate(); // Appelle la fonction de fermeture du pop-up après succès
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du mot de passe.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup bg-white p-4 rounded-lg shadow-lg">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogTitle>Modifier le mot de passe</DialogTitle>
          <DialogDescription>
            Cliquez sur "Mettre à jour" lorsque vous avez terminé.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentPassword" className="text-right">
                Mot de passe actuel
              </Label>
              <Input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">
                Nouveau mot de passe
              </Label>
              <Input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right">
                Confirmer le nouveau mot de passe
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="col-span-3"
              />
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
