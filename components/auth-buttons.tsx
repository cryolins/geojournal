"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function LogoutButton () {
    //const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const logoutClick = async () => {
        console.log("clicked log out");
        //setIsSubmitting(true);
        await signOut({ callbackUrl: '/login' });
    }
    return (
        <button className="flex items-center justify-center p-1 px-4 bg-bad rounded-full w-fit hover:bg-[#c04d47] transition-colors">
            <h6 className="contrast-text" onClick={logoutClick}>Log out{/*isSubmitting ? "..." : ""*/}</h6>
        </button>
    );
}