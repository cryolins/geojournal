"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { H3HexagonLayer } from "@deck.gl/geo-layers";
import { H3HexData } from "@/interfaces/data";
import DeckGL, { CompassWidget, MapViewState, PickingInfo, ZoomWidget } from "deck.gl";
import Map from "react-map-gl/maplibre";
import { _GeocoderWidget } from "@deck.gl/widgets";

function getRGBAColor(hexColor: string, lastActivity: string): [number, number, number, number] {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const days = (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);
    const a = Math.round(255 * (0.25 + (0.75 / ((0.02 * days) ** 2 + 1)))); // just a fun function

    return [r, g, b, a];
}

interface DataMapProps{
    data: H3HexData[]
    initialCoords: [number, number] // [lat, lng] format
}

export default function VisualizeMap({ data, initialCoords }: DataMapProps) {
    console.log(data);
    // initial view state based on given initialCoords
    const initialViewState: MapViewState = {
        latitude: initialCoords[0],
        longitude: initialCoords[1],
        zoom: 11,
        minZoom: 4,
        maxZoom: 16,
        bearing: 0,
        pitch: 40
    };

    // h3hexagon layer
    const layers = [
        new H3HexagonLayer<H3HexData>({
            // basic setup
            id: "notes-vis-hex",
            data,
            getHexagon: (h) => h._id,

            // elevation of hexagons
            extruded: true,
            getElevation: (h) => h.noteCount,
            elevationScale: 40,

            // color of hexagons
            getFillColor: (h) => getRGBAColor(h.dominantCategory.color, h.lastActivity),

            // pickable
            pickable: true,
            
            // material (fun!)
            material: {
                ambient: 0.4,
                diffuse: 0.6,
                shininess: 36,
                specularColor: [168, 168, 168]
            }
        })
    ];

    const getTooltips = (pi: PickingInfo<H3HexData>) => {
        if (!pi.object) {return null}
        return {
            html: `<p>
                    <b>${pi.coordinate ? [pi.coordinate[1].toFixed(4), pi.coordinate[0].toFixed(4)] : "Unknown location"}</b><br/>
                    Most common category: ${pi.object.dominantCategory.name}<br/>
                    Notes: ${pi.object.noteCount}<br/>
                    First activity: ${new Date(pi.object.firstActivity).toLocaleDateString()}<br/>
                    Last activity: ${new Date(pi.object.lastActivity).toLocaleDateString()}            
                </p>`
        }
    }
    
    return(
        <DeckGL 
            layers={layers}
            effects={[]}
            initialViewState={initialViewState}
            controller
            getTooltip={getTooltips}
            width="100%"
            height="100%"
        >
            <Map 
                reuseMaps
                mapLib={import("maplibre-gl")}
                mapStyle={"https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"}
            />
        </DeckGL>
    );
};