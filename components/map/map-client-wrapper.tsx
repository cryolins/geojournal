"use client";
import dynamic from "next/dynamic";

// wrapper of leaflet map to dynamically load the map in a client component

const MapComponent = dynamic(() => import("./map"), { 
    ssr: false,
    loading: () => <LoadingComponent />
 });

function LoadingComponent() {

    return(
        <div className="flex w-full h-full items-center justify-center">
            <h1 className="contrast-text font-bold">Loading map...</h1>
        </div>
    );
    
}

export default function MapClientWrapper() {

    return(
        <MapComponent />
    );
}