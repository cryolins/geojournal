import { LatLng } from "leaflet";
import { Dispatch, SetStateAction } from "react";
import { useMapEvents } from "react-leaflet";
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';


interface HookProps {
    setClickedCoords: Dispatch<SetStateAction<LatLng | undefined>>
}

export default function HomeMapHooks({ setClickedCoords }: HookProps) {
    const mapEvents = useMapEvents({
        click: (e) => {
                setClickedCoords(e.latlng);
            }
        }
    );
    return null;
}