import { CategoryData, NoteData } from "@/interfaces/data";
import { APIResponseData } from "@/interfaces/responses";
import { LatLng } from "leaflet";
import { Dispatch, SetStateAction } from "react";

const defaultCoords: [number, number] = [43.645, -79.38]; // Toronto Union Station as default

const emptyStringArray: string[] = []
const blankNoteTemplate = {
    _id: "", // placeholder id to indicate blank note
    title: "",
    body: "",
    imageLinks: emptyStringArray,
    categoryIds: emptyStringArray
}

// get user location: based on given, localStorage, or default
export function getUserLocation(setInitialCoords: Dispatch<SetStateAction<[number, number] | undefined>>) {
    let coords = defaultCoords; 
    const storedCoords = localStorage.getItem("lastLocation");
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                coords = [pos.coords.latitude, pos.coords.longitude];
                setInitialCoords(coords);
            },
            (err) => {
                console.log(err.message);
                if (storedCoords) {
                    coords = JSON.parse(storedCoords);
                }
                setInitialCoords(coords);
            }
        );
    } else if (storedCoords) {
        coords = JSON.parse(storedCoords);
        setInitialCoords(coords);
    }
}

export async function fetchNotes(setNotes: Dispatch<SetStateAction<Map<string, NoteData>>>) {
    try {
        const res = await fetch("/api/notes", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const resData: APIResponseData<NoteData[]> = await res.json();
        if (resData.status === "error") {
            console.error(resData.message);
        } else {
            setNotes(new Map(resData.resData.map((note) => [note._id, note])));
        }
        
    } catch (error) {
        console.error(error);
    }
}

export async function fetchCategories(setCategories: Dispatch<SetStateAction<Map<string, CategoryData>>>, 
                                      setKeptCategoryIds: Dispatch<SetStateAction<string[]>>) {
    try {
        const res = await fetch("/api/categories", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const resData: APIResponseData<CategoryData[]> = await res.json();
        if (resData.status === "error") {
            console.error(resData.message);
        } else {
            setCategories(new Map(resData.resData.map((category) => [category._id, category])));
            setKeptCategoryIds(resData.resData.map((category) => category._id));
        }
        
    } catch (error) {
        console.error(error);
    }
}

export function addNewNote(setCurrNote: Dispatch<SetStateAction<NoteData | undefined>>, clickedCoords: LatLng) {
    const now = new Date();
    const newNote: NoteData = {
        ...blankNoteTemplate,
        location: {coordinates: [clickedCoords.lng, clickedCoords.lat]},
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
    }
    setCurrNote(newNote);
}

export function hasDiffLocation(note1: NoteData | undefined, note2: NoteData | undefined) {
    if (!note1 || !note2) {
        return false;
    }

    const coords1 = note1.location.coordinates;
    const coords2 = note2.location.coordinates;
    return (coords1[0] !== coords2[0]) || (coords1[1] !== coords2[1]);
}
