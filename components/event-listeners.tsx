"use client";
import { Map } from "leaflet";
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

// saves map location for later visits, 
export function MapLocationSaver ({ map }: { map: Map }) {
    useEffect(
        () => {
            const handleUnloadSave = (e: BeforeUnloadEvent) => {
                const center = map.getCenter();
                localStorage.setItem("lastLocation", JSON.stringify(center)); // can abstract storage key
            };
            window.addEventListener("beforeunload", handleUnloadSave);
            
            return () => {
                window.removeEventListener('beforeunload', handleUnloadSave);
            };
        },
        []
    );
    return null;
}