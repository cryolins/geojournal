"use client";
import dynamic from "next/dynamic";

// wrapper of leaflet map to dynamically load the map in a client component

const MapComponent = dynamic(() => import("./home-map"), { 
    ssr: false,
    loading: () => <LoadingComponent />
 });

function LoadingComponent() {

    return(
        <div className="w-full h-full bg-background" />
    );
    
}

export default function HomeMapClientWrapper() {

    return(
        <MapComponent />
    );
}