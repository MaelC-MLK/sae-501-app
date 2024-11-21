"use client";

import PopupCreationEvent from "@/components/sections/popupCreationEvent";
import Calendar from "@/components/sections/calendar";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserProvider";
import { useRouter } from "next/navigation";

export default function Page(){
    const [ loading, setLoading ] = useState(true);
    const userContext = useUser();
    const router = useRouter();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!userContext.user) {
                router.push('/login');
            }
        }, 10000);

        if (!userContext.user) {
            return () => clearTimeout(timeoutId);
        }

        setLoading(false);
    }, [userContext.user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-4 border-gray-200"></div>
                    <p className="mt-4 text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }
    
    return (
        <>
        <div className="pt-16">
            <PopupCreationEvent />
            <Calendar />
        </div>
        </>
    )
}