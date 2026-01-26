"use client";
import { LuMapPinned, LuUserRound } from "react-icons/lu";


export function SettingsButton() {
    return (
        <a className="w-12 aspect-square bg-border-frame transition-colors rounded-full p-1.5 m-1 
                            drop-shadow-md drop-shadow-background" href="/settings">
            <LuUserRound className="w-full h-full"/>
        </a>
    );
}

export function NotesMapButton() {
    return (
        <a className="w-12 aspect-square bg-border-frame transition-colors rounded-full p-1.75 m-1 
                            drop-shadow-md drop-shadow-background" href="/map">
            <LuMapPinned className="w-full h-full"/>
        </a>
    );
}

export function HomeTextButton() {
    return (
        <div className="flex w-fit h-fit justify-center align-bottom">
            <a href="/"
                    className="flex flex-row bg-border-frame items-center justify-center w-fit min-w-fit gap-2 px-2.5 pt-1 h-10 rounded-full transition-colors">
                <p className="font-semibold relative contrast-text cursor-pointer text-lg pl-1 geojournal-text"><span className="text-good">geo</span>journal!
                    <span className="absolute -top-1.25 -left-0.5 text-[#8ea9dd] text-xs -rotate-6 geojournal-text">cryo's</span>
                </p>
            </a>
        </div>
    );
}