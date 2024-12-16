"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { PopUpEmailRegister } from "@/components/sections/popUpEmailRegister";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState({ email: email, plainPassword: plainPassword, firstName: firstName, lastName: lastName });
  const [loadingButton, setLoadingButton] = useState(false);
  const [open, setOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && password.length <= 30;
  };

  const validateNoNumbersOrSpecialChars = (str) => {
    const regex = /^[a-zA-Z\sÀ-ÖØ-öø-ÿ-]+$/;
    return regex.test(str);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingButton(true);

    if (!validateEmail(email)) {
      setError("Entrez une adresse email valide");
      setLoadingButton(false);
      return;
    }

    if (!validatePassword(plainPassword)) {
      setError("Le mot de passe doit contenir entre 8 et 30 caractères");
      setLoadingButton(false);
      return;
    }

    if (plainPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoadingButton(false);
      return;
    }

    if (!validateNoNumbersOrSpecialChars(firstName)) {
      setError("Le prénom doit contenir uniquement des lettres ou -");
      setLoadingButton(false);
      return;
    }

    if (!validateNoNumbersOrSpecialChars(lastName)) {
      setError("Le nom doit contenir uniquement des lettres ou -");
      setLoadingButton(false);
      return;
    }

    if (!acceptedTerms) {
      setError("Vous devez accepter les conditions d'utilisation et la politique de confidentialité.");
      setLoadingButton(false);
      return;
    }

    try {
      const api = process.env.API_BASE_URL;
      const url = `${api}/api/user/register`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify({ email, plainPassword, firstName, lastName }),
      });

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error("Cette adresse email existe déjà");
        }
        throw new Error("Echec de la création du compte");
      }

      setLoadingButton(false);
      setOpen(true);
    } catch (err) {
      setLoadingButton(false);
      setError(err.message || "Une erreur est survenue");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label className="text-lg" htmlFor="firstName">
          Prénom*
        </Label>
        <Input
          type="text"
          id="firstName"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <Label className="text-lg" htmlFor="lastName">
          Nom*
        </Label>
        <Input
          type="text"
          id="lastName"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <Label className="text-lg" htmlFor="email">
          Adresse mail*
        </Label>
        <Input
          type="email"
          id="email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-6 relative">
        <Label className="text-lg" htmlFor="plainPassword">
          Mot de passe*
        </Label>
        <div className="relative w-full">
            <Input
            type={showPassword ? "text" : "password"}
            id="plainPassword"
            placeholder="**********"
            value={plainPassword}
            onChange={(e) => setPlainPassword(e.target.value)}
            required
            />
            <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
            >
                <img
                src={showPassword ? "/images/show.svg" : "/images/no-show.svg"}
                alt="Toggle Password Visibility"
                className="w-5 h-5"
                />
            </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <Label className="text-lg" htmlFor="confirmPassword">
          Confirmer le mot de passe*
        </Label>
        <div className="relative w-full">
            <Input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="**********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />
            <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
                <img
                src={showConfirmPassword ? "/images/show.svg" : "/images/no-show.svg"}
                alt="Toggle Password Visibility"
                className="w-5 h-5"
                />
            </button>
            </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked)}
        />
        <Label htmlFor="terms">
          J'accepte les
          <Link href="/conditions-utilisation"> conditions d'utilisation</Link> et la
          <Link href="/politique-confidentialite"> politique de confidentialité</Link>.
        </Label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loadingButton || !acceptedTerms}
        className="w-full py-6 text-lg rounded-md transition"
      >
        {loadingButton ? "Inscription..." : "S'inscrire"}
      </Button>

      <PopUpEmailRegister user={user} open={open} setOpen={setOpen} />
    </form>
  );
}
