"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PopUpEditProfile } from "@/components/sections/popUpEditProfile";
import { PopUpLogout } from "@/components/sections/popUpLogout";
import { PopUpJoinEventify } from "@/components/sections/popUpJoinEventify";
import Link from "next/link";
import { k2d } from "@/app/fonts/fonts"
import { useUser } from "@/contexts/UserProvider";
import { useRouter } from "next/navigation";
import { CarouselInscris } from "@/components/sections/carouselInscris";
import { fetchUserEvents } from "@/lib/data";
import { fetchUserById } from "@/lib/data";
import { SkeletonProfile } from "@/components/skeletons/skeletons";

export default function Profile() {
  const userContext = useUser();
  const [events, setEvents] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>();
  const [error, setError] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const router = useRouter();


  useEffect(() => {
    if (!userContext.user) return;

    const fetchEvents = async () => {
      try {
        if (userContext.user) {
          const data = await fetchUserEvents(userContext.user.id);
          setEvents(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        setError("Erreur lors de la récupération des événements");
      } finally {
        setLoadingEvents(false);
      }
    };

    const fetchUserData = async () => {
      try {
        if (!userContext.user) return;
        const data = await fetchUserById(userContext.user.id);
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue");
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchEvents();
    fetchUserData();

  }, [userContext.user]);

  const loading = loadingEvents || loadingUserData;

  if (loading) {
    return (
      <SkeletonProfile/>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-4">
        <p className="text-red-500">Erreur : {error}</p>
        <Button onClick={() => router.push("/")}>Revenir à l'accueil</Button>
      </div>
    );
  }

  return (
    <div className=" min-h-screen p-10 pt-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 p-4 bg-primary">
            <div className="flex items-center justify-end gap-3 mb-4">
              <div>
                {userData ? (
                  <PopUpEditProfile
                    user={userData}
                    onUpdate={(updatedUser: typeof userData) => setUserData(updatedUser)}
                    userContext={{ ...userContext, userContextUser: userContext.user }}
                  />
                ) : (
                  <p>Chargement du profil...</p>
                )}
              </div>
              <div>
                {userData ? (
                  <PopUpLogout />
                ) : (
                  <p>...</p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src={userData.avatar ? `${process.env.API_BASE_URL}/uploads/users/` + userData?.avatar : '/images/profile-picture.webp'}
                  alt="Profile Picture"
                  layout="fill"
                  objectFit="cover"
                  unoptimized={true}
                />
              </div>
              <h2 className={`${k2d.className} mt-4 text-2xl capitalize font-semibold text-white`}>
              {userData?.lastName} {userData?.firstName} 
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-white">{userData?.email}</p>
              </div>
              <PopUpJoinEventify>
              </PopUpJoinEventify>
            </div>
          </div>

          <div className="flex flex-col gap-6  lg:w-2/3 p-6">
            <div className="flex justify-items justify-between items-center">
              <h3 className={`${k2d.className} text-2xl font-bold text-gray-800`}>Mes événements à venir</h3>
              <Link href="/profile/calendar" >
                <Button variant="default" className="text-lg px-6">
                  Mon calendrier
                </Button>
              </Link>
            </div>
            {events.length > 0 ? (<CarouselInscris events={events} />) : (<p className="text-gray-800">Vous n'êtes inscrit à aucun événement</p>)}
          </div>
        </div>
      </div>
      <div className="w-144 h-144 bg-primary rounded-full blur-6xl absolute -right-52 -top-64 -z-10" />
    </div>
  );
}
