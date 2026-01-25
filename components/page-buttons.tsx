"use client";
import { useRouter } from "next/navigation";
import { LuMapPinned, LuUserRound } from "react-icons/lu";


export function SettingsButton() {
    const router = useRouter();

    return (
        <a className="w-12 aspect-square bg-border-frame transition-colors rounded-full p-1.5 m-1 
                            drop-shadow-md drop-shadow-background" href="/settings">
            <LuUserRound className="w-full h-full"/>
        </a>
    );
}

export function NotesMapButton() {
    const router = useRouter();

    return (
        <a className="w-12 aspect-square bg-border-frame transition-colors rounded-full p-1.5 m-1 
                            drop-shadow-md drop-shadow-background" href="/map">
            <LuMapPinned className="w-full h-full"/>
        </a>
    );
}