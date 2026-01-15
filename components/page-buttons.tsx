"use client";
import { useRouter } from "next/navigation";
import { LuUserRound } from "react-icons/lu";


export function SettingsButton() {
    const router = useRouter();

    return (
        <a className="w-12 aspect-square bg-background hover:bg-backgroundlight transition-colors rounded-full p-1.5 border-foreground border-solid border-2 
                            absolute right-2 top-2 drop-shadow-md drop-shadow-background" href="/settings">
            <LuUserRound className="w-full h-full"/>
        </a>
    );
}