import { NoteData } from "@/interfaces/data";
import { LatLng } from "leaflet";
import { Dispatch, SetStateAction, useContext } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { MapStatesContext } from "./map";
import { MapLocationSaver } from "../event-listeners";

interface HookProps {
    setClickedCoords: Dispatch<SetStateAction<LatLng | undefined>>
}

export default function MapHooks({ setClickedCoords }: HookProps) {
    const { isNoteMoving, setIsNoteMoving, setIsSaved, currNote, setCurrNote } = useContext(MapStatesContext);
    const map = useMap();
    const mapEvents = useMapEvents({
        click: (e) => {
            if (isNoteMoving) {
                setIsNoteMoving(false);
                if (currNote) {
                    const newCoords: [number, number] = [e.latlng.lng, e.latlng.lat];
                    setCurrNote({
                        ...currNote,
                        location: { coordinates: newCoords }
                    });
                    setIsSaved(false);
                } else {
                    console.log("location not saved: no note selected");
                }
            } else {
                setClickedCoords(e.latlng);
            }
        }
    });

    return <MapLocationSaver map={map}/>;
}