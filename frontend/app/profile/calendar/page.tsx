"use client";

import PopupCreationEvent from "@/components/sections/popupCreationEvent";
import Calendar from "@/components/sections/calendar";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserProvider";
import { useRouter } from "next/navigation";
import Drafts from "@/components/sections/drafts";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('calendar');
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

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen w-full">
    //             <div className="text-center">
    //                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 border-solid border-4"></div>
    //                 <p className="mt-4 text-gray-700">Loading...</p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <>
            <div className="pt-14">
                <div className="border-b relative overflow-hidden">
                    <div className="w-144 h-144 bg-primary rounded-full blur-6xl absolute -right-52 -top-64 -z-10 opacity-30 hidden md:block" />

                    <div className="flex max-w-7xl justify-self-center w-full overflow-hidden ">
                        <button
                            className={`px-2 md:px-6 py-4 md:py-5 flex items-center gap-2 w-full justify-center md:w-auto md:justify-start font-medium border-b-4 text-sm sm:text-base ${view === 'calendar' ? 'border-primary' : 'opacity-60 border-transparent'}`}
                            onClick={() => setView('calendar')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                            </svg>

                            Mon calendrier
                        </button>
                        <button
                            className={`px-2 md:px-6 py-4 md:py-5 flex items-center gap-2 w-full justify-center md:w-auto md:justify-start font-medium border-b-4 text-sm sm:text-base ${view === 'drafts' ? 'border-primary' : 'opacity-60 border-transparent'}`}
                            onClick={() => setView('drafts')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 sm:size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>

                            Brouillons
                        </button>
                    </div>
                </div>
                <PopupCreationEvent />
                {
                    loading ? (
                        <>
                            <div className="flex items-center justify-center min-h-screen">
                                <div className="text-center">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"></div>
                                    <p className="mt-4 text-gray-700">Chargement...</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {view === 'calendar' ? <Calendar /> : <Drafts />} {/* Affiche le composant approprié */}
                        </>
                    )
                }

            </div>
        </>
    );
}
