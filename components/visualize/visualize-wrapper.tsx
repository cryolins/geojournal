"use client";

import { ChangeEventHandler, useEffect, useState } from "react";
import { getUserLocation } from "../map/map-functions";
import { useMounted } from "../use-mounted";
import { H3HexData } from "@/interfaces/data";
import VisualizeMap from "./visualize-map";
import { APIResponseData } from "@/interfaces/responses";
import { VALID_RESOLUTIONS } from "./visualize-config";

export default function VisualizeClientWrapper() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [initialCoords, setInitialCoords] = useState<[number, number]>();
    const [visData, setVisData] = useState<H3HexData[][]>([]);
    const [mounted] = useMounted();

    // h3 resolution choice for map
    const [resChoice, setResChoice] = useState<number>(1);

    async function getVisData() {
        try {
            for (const resolution of VALID_RESOLUTIONS) {
                const res = await fetch(`/api/visualize?h3res=${resolution}`);
                const resData: APIResponseData<H3HexData[]> = await res.json();

                if (resData.status === "error") {
                    console.error(resData.message);
                } else {
                    console.log(`got resolution ${resolution}`)
                    setVisData(prev => [...prev, resData.resData]);
                }
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleSliderChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setResChoice(Number(e.currentTarget.value));
    };

    // setup on mount
    useEffect(() => {
        setIsPageLoading(prev => true);
        getUserLocation(setInitialCoords);
        getVisData();
        setIsPageLoading(prev => false);
    }, []);

    if (!mounted || isPageLoading || !initialCoords || visData.length != VALID_RESOLUTIONS.length) {
        return (
            <div className="flex flex-col sm:flex-row w-full h-screen items-center justify-center gap-3">
                <h1 className="contrast-text font-bold loading-msg">
                    Loading visualizer map...
                </h1>
            </div>
        );
    }

    return (
        <div className="w-full h-screen">
            <VisualizeMap dataList={visData} initialCoords={initialCoords} resChoice={resChoice}/>
            <div className="p-2 absolute bottom-0 left-0">
                <div className="flex flex-col items-center justify-center size-fit rounded-xl px-3 pb-3
                                bg-background outline-foreground outline-solid outline-2">
                    <h5>⬢ Size</h5>
                    <input type="range" min={0} max={VALID_RESOLUTIONS.length-1} step={1} 
                           value={resChoice} onChange={handleSliderChange} className="custom-slider"/>
                </div>
            </div>
        </div>
    );
}