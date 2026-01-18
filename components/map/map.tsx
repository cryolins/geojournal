"use client";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, ZoomControl } from 'react-leaflet'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CategoryData, NoteData } from '@/interfaces/data';
import { addNewNote, fetchCategories, fetchNotes, getUserLocation, hasDiffLocation } from './map-functions';
import MapHooks from './map-hooks';
import { LatLng } from 'leaflet';
import { LuPlus } from 'react-icons/lu';
import NoteMenu from './note-menu';
import { SettingsButton } from '../page-buttons';
import { MapNavbar } from './map-navbar';

// context for states
type MapStatesContextType = {
    currNote?: NoteData
    setCurrNote: Dispatch<SetStateAction<NoteData | undefined>>
    isSaved: boolean
    setIsSaved: Dispatch<SetStateAction<boolean>>
    isNoteMoving: boolean
    setIsNoteMoving: Dispatch<SetStateAction<boolean>>
    categories: Map<string, CategoryData>
    setCategories: Dispatch<SetStateAction<Map<string, CategoryData>>>
    notes: Map<string, NoteData>
    setNotes: Dispatch<SetStateAction<Map<string, NoteData>>>
}

export const MapStatesContext = createContext<MapStatesContextType>({
    currNote: undefined,
    setCurrNote: () => {},
    isSaved: true,
    setIsSaved: () => {},
    isNoteMoving: false,
    setIsNoteMoving: () => {},
    categories: new Map<string, CategoryData>(),
    setCategories: () => {},
    notes: new Map<string, NoteData>(),
    setNotes: () => {}
});

export default function MapComponent() {
    // useStates
    const [initialCoords, setInitialCoords] = useState<[number, number]>();
    const [clickedCoords, setClickedCoords] = useState<LatLng>();
    const [notes, setNotes] = useState<Map<string, NoteData>>(new Map());
    const [categories, setCategories] = useState<Map<string, CategoryData>>(new Map());
    const [currNote, setCurrNote] = useState<NoteData>();
    const [isSaved, setIsSaved] = useState(true);
    const [isNoteMoving, setIsNoteMoving] = useState<boolean>(false);

    // context value now that the states have been created
    const contextValue = {
        currNote, setCurrNote, isSaved, setIsSaved, isNoteMoving, setIsNoteMoving, 
        categories, setCategories, notes, setNotes
    };

    // map setup on mount
    useEffect(() => {
        getUserLocation(setInitialCoords);
        fetchNotes(setNotes);
        fetchCategories(setCategories);
    }, []);
    
    // receive location permissions before loading map
    if (!initialCoords) {
        return (
            <div className="flex w-full h-full items-center justify-center">
                <h1 className="contrast-text font-bold">Waiting for location permissions...</h1>
            </div>
        );
    }

    return (
        <MapStatesContext value={contextValue}>
            <div className="flex flex-row items-center justify-center w-full h-full">
                <NoteMenu />
                <div className="flex items-center justify-center w-full h-full max-h-full max-w-full relative">
                    <MapContainer center={initialCoords} zoom={13} zoomControl={false}>

                        {/* tile layer for openstreetmap credit */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* moving zoom control to bottom right */}
                        <ZoomControl position="bottomright" />

                        {/* hooks component for map events */}
                        <MapHooks   setClickedCoords={setClickedCoords} setIsSaved={setIsSaved}
                                    currNote={currNote} setCurrNote={setCurrNote}
                                    isNoteMoving={isNoteMoving} setIsNoteMoving={setIsNoteMoving} />

                        {/* set of loaded notes */}
                        {Array.from(notes?.values()).map((note) => (
                            <Marker 
                                position={note.location.coordinates} 
                                key={note._id}
                                eventHandlers={{
                                    click: () => {
                                        if (!isNoteMoving) {
                                            console.log(`clicked ${note._id}`)
                                            setCurrNote(note);
                                        }
                                    }
                                }}
                            >
                                <Tooltip>{note.title}</Tooltip>
                            </Marker>
                        ))}

                        {/* "ghost note" for if current note has updated, unsaved position */}
                        {(currNote && hasDiffLocation(currNote, notes.get(currNote._id))) &&
                            <Marker opacity={0.6} position={currNote.location.coordinates}>
                                <Tooltip>{`unsaved: ${currNote.title}`}</Tooltip>
                            </Marker>
                        }

                        {/* popup at clicked location */}
                        {(clickedCoords && true) && 
                            <Popup position={clickedCoords}>
                                <div className="flex flex-row items-center justify-center gap-x-3 contrast-text h-fit">
                                    <div className="font-public-sans">
                                        {clickedCoords.lat.toFixed(6)},<br/>{clickedCoords.lng.toFixed(6)}
                                    </div>
                                    <button onClick={(e) => addNewNote(setCurrNote, clickedCoords)} className="flex flex-row items-center justify-center p-2 gap-x-1 rounded-lg bg-primary hover:bg-secondary transition-colors">
                                        <LuPlus className="w-full h-full aspect-square" />
                                        <h6 className="font-semibold">Add Note</h6>
                                    </button>
                                </div>
                            </Popup>}

                    </MapContainer>
                    
                    <MapNavbar />
                </div>
            </div>
        </MapStatesContext>
    );
}