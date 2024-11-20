"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PopUpEditProfile } from "@/components/sections/popUpEditProfile";
import { PopUpDeleteUser } from "@/components/sections/popUpDeleteUser";
import Link from "next/link";
import { useUser } from "@/contexts/UserProvider";

export default function Profile() {
  const userContext = useUser();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!userContext.user) {
      return;
    }

    const fetchUserData = async () => {
      try {
        
        const api = "http://localhost:8080";
        const url = `${api}/api/users/${userContext.user.id}`;

        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/ld+json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données utilisateur");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userContext.user]); // On ne veut pas que l'ID utilisateur change, donc [] comme dépendance.

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          <p className="mt-4 text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-10 pt-24">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                {userData ? (
                  <PopUpEditProfile
                    user={userData}
                    onUpdate={(updatedUser) => setUserData(updatedUser)}
                  />
                ) : (
                  <p>Chargement du profil...</p>
                )}
              </div>
              <div>
                {userData ? (
                  <PopUpDeleteUser
                    user={userData}
                  />
                ) : (
                  <p>...</p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={"http://localhost:8080/uploads/users/"+userData?.avatar}
                  alt="Profile Picture"
                  layout="fill"
                  objectFit="cover"
                  unoptimized={true}
                />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                {userData?.firstName} {userData?.lastName}
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-gray-700">{userData?.email}</p>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 p-6">
            <h3 className="text-2xl font-bold text-gray-800">Mes Événements</h3>
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-gray-100 rounded">
                <p className="text-gray-700">Mes événements à venir</p>
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <p className="text-gray-700">Mes événements favoris</p>
              </div>
            </div>

            <Link href="/profile/calendar" >
                <Button variant="default" className="mt-10">
                    Mon calendrier
                </Button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
