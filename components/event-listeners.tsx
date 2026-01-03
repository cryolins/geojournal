"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";


export function StorageListener () {
    useEffect(
        () => {
            const handleStorageChange = (e: StorageEvent) => {
                if (e.key === "logoutEvent") {
                    redirect("/login");
                }
            };
            window.addEventListener("storage", handleStorageChange);
            
            return () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        },
        []
    );
    return null;
}