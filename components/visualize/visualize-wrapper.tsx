"use client";

import { useEffect, useState } from "react";
import { getUserLocation } from "../map/map-functions";
import { useMounted } from "../use-mounted";
import { H3HexData } from "@/interfaces/data";
import VisualizeMap from "./visualize-map";
import { APIResponseData } from "@/interfaces/responses";

export default function VisualizeClientWrapper() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [initialCoords, setInitialCoords] = useState<[number, number]>();
    const [visData, setVisData] = useState<H3HexData[]>();
    const [mounted] = useMounted();

    async function getVisData() {
        try {
            const res = await fetch("/api/visualize");
            const resData: APIResponseData<H3HexData[]> = await res.json();

            if (resData.status === "error") {
                console.error(resData.message);
            } else {
                setVisData(resData.resData);
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    // setup on mount
    useEffect(() => {
        setIsPageLoading(prev => true);
        getUserLocation(setInitialCoords);
        getVisData();
        setIsPageLoading(prev => false);
    }, []);

    if (!mounted || isPageLoading || !initialCoords || visData == null) {
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
            <VisualizeMap data={visData} initialCoords={initialCoords} />
        </div>
    );
}