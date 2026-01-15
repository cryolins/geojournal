import { NoteData } from "@/interfaces/data";
import { LatLng } from "leaflet";
import { Dispatch, SetStateAction } from "react";
import { useMap, useMapEvents } from "react-leaflet";

interface HookProps {
    setClickedCoords: Dispatch<SetStateAction<LatLng | undefined>>
    setIsSaved: Dispatch<SetStateAction<boolean>>
    currNote?: NoteData 
    setCurrNote: Dispatch<SetStateAction<NoteData | undefined>>
    isNoteMoving: boolean
    setIsNoteMoving: Dispatch<SetStateAction<boolean>>
}

export default function MapHooks({ 
    setClickedCoords, setIsSaved, currNote, setCurrNote, isNoteMoving, setIsNoteMoving
 }: HookProps) {
    const map = useMap();
    const mapEvents = useMapEvents({
        click: (e) => {
            if (isNoteMoving) {
                setIsNoteMoving(false);
                if (currNote) {
                    const newCoords: [number, number] = [e.latlng.lat, e.latlng.lng];
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

    return null;
}