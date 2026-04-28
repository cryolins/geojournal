"use client";

import { LatLng } from "leaflet";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import HomeMapHooks from "./home-map-hooks";
import Image from "next/image";
import { auth } from "@/auth-edge";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { FaGithub } from "react-icons/fa6";

export default function HomeMapComponent() {
    const [clickedCoords, setClickedCoords] = useState<LatLng>();
    const { data: session } = useSession();

    return (
        <div className="flex items-center justify-center size-full relative">
            {/* map */}
            <MapContainer center={[43.645, -79.38]} zoom={13} zoomControl={false}>
                {/* tile layer for openstreetmap credit */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* hooks component for map events */}
                <HomeMapHooks setClickedCoords={setClickedCoords} />

                {/* marker at clicked location */}
                {clickedCoords &&
                    <Marker position={clickedCoords}>
                        <Tooltip>New note: <strong>click me!</strong></Tooltip>
                        <Popup>
                            <a href="/map">
                                Create a new note!
                            </a>
                        </Popup>
                    </Marker>
                }

            </MapContainer>

            {/* overlays */}
            <div className="flex flex-col absolute inset-0 pointer-events-none bg-neutral-400/40 px-6 sm:px-15 py-4 sm:py-10 gap-4 items-center justify-center">
                {/* title */}
                <div className="relative size-fit min-h-fit max-w-fit rounded-3xl pl-4 pr-3 backdrop-blur-xs">
                    <p className="text-[16vw] sm:text-[10vw] text-neutral-900 font-black geojournal-text
                               drop-shadow-xl drop-shadow-neutral-300">
                        geojournal!
                        <span className="absolute top-[2vw] left-0 text-[#8ea9dd] text-[3.2vw] sm:text-[2vw] -rotate-6 geojournal-text">cryo's</span>
                    </p>
                </div>

                {/* desc and image box */}
                <div className="flex flex-col sm:flex-row bg-background w-full h-fit max-h-full justify-around items-center 
                                rounded-4xl p-8 pointer-events-auto gap-4 overflow-y-auto fg-scrollbar wrap-break-word">
                    <div className="flex flex-col w-full h-fit sm:w-9/20 gap-4 sm:overflow-y-auto">
                        <p className="w-full contrast-text">
                            <span className="geojournal-text italic text-primary text-xl">geojournal!</span> is an interactive map-based journaling webapp, allowing users to create and edit geotagged notes and explore their notetaking patterns with modern geo-data visualization libraries.
                            <br/><br/><span className="italic">Create journal notes now!</span>
                        </p>
                        <div className="flex flex-wrap w-full h-fit min-h-10 gap-4 p-2 sm:items-center">
                            <a href={session ? "/map" : "signup"}
                                    className="flex fit-pill-button w-1/3 min-w-fit h-fit gap-x-2 gap-y-1 p-1.5 bg-primary hover:bg-secondary rounded-full transition-colors cursor-pointer
                                                contrast-text drop-shadow-md drop-shadow-neutral-950">
                                <h6 className="font-semibold">{session ? "Go to map!" : "Sign up!"}</h6>
                            </a>
                            <a href={"https://github.com/cryolins/geojournal"}
                                    className="flex flex-row fit-pill-button w-1/3 min-w-fit h-fit gap-2 p-1.5 bg-[#24292e] hover:bg-[#2b3137] rounded-full transition-colors cursor-pointer 
                                                contrast-text drop-shadow-md drop-shadow-neutral-950">
                                <FaGithub className="text-[#f9f4ec]" />
                                <h6 className="font-semibold text-[#f9f4ec]">Github ↗</h6>
                            </a>
                        </div>
                    </div>
                    <div className="w-full sm:w-9/20 h-fit">
                        <img className="object-contain" src={"/demo-images/main-promo.png"} alt="demo promo image"/>
                    </div>
                </div>
            </div>
        </div>
    );
}