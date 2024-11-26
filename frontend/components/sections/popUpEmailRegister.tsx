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
import React, { useState } from "react";
import { UserRegister } from "@/types/user";

export function PopUpEmailRegister({ user, open, setOpen }: { user: UserRegister, open: boolean, setOpen: (open: boolean) => void })  {
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const api = 'http://localhost:8080';
      const url = api + '/api/user/register';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': "application/ld+json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error('Email already exists');
        }

        throw new Error('Failed to create account');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>C'est presque bon !</DialogTitle>
          {error && <DialogDescription className="text-red-500">{error}</DialogDescription>}
          <DialogDescription>
            Un email de confirmation a été envoyé à {user.email}. Veuillez cliquer sur le lien pour activer votre compte
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={handleSubmit}>
            Renvoyer l'email de confirmation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
