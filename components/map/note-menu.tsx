"use client";
import { CategoryData, NoteData } from "@/interfaces/data"
import { ChangeEventHandler, Dispatch, FocusEventHandler, MouseEventHandler, SetStateAction, useContext, useEffect, useState } from "react"
import { LuPlus, LuTrash2, LuX } from "react-icons/lu";
import { CategoryDropdown } from "./category-dropdown";
import { APIResponseData } from "@/interfaces/responses";
import { MapStatesContext } from "./map";

interface NoteFields{
    title: string
    body: string
}

export default function NoteMenu() {
    const [titleLength, setTitleLength] = useState(0);
    const [bodyLength, setBodyLength] = useState(0);
    const [showCatDropdown, setShowCatDropdown] = useState(false);
    const [saveErrored, setSaveErrored] = useState(false);
    
    // getting MapStatesContext
    const {
        currNote, setCurrNote, isSaved, setIsSaved, isNoteMoving, setIsNoteMoving, 
        categories, setCategories, notes, setNotes
    } = useContext(MapStatesContext);

    const dateCreated = currNote ? new Date(currNote?.createdAt) : new Date();
    const dateUpdated = currNote ? new Date(currNote?.updatedAt) : new Date();
    
    const setUnsaved = () => setIsSaved(false);
    const handleSave = async () => {
        if (!currNote) { return }

        const payload = {
                    title: currNote.title,
                    body: currNote.body,
                    imageLinks: currNote.imageLinks,
                    categoryIds: currNote.categoryIds,
                    lng: currNote.location.coordinates[0],
                    lat: currNote.location.coordinates[1],
                };

        const methodType = currNote._id ? "PUT" : "POST";

        try {
            const res = await fetch(`/api/notes/${currNote._id}`, {
                method: methodType,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const resData: APIResponseData<NoteData> = await res.json();

            if (resData.status === "error") {
                setSaveErrored(true);
                console.error(res);
                return;
            }

            // setting updated note data to currData
            const updatedData = resData.resData;
            setCurrNote(prev => updatedData);
            setIsSaved(true);

            // updating notes list
            setNotes(prevMap =>
                new Map(
                    [...prevMap.entries()].filter(
                        (entry) => entry[0] !== updatedData._id
                    ).concat([[updatedData._id, updatedData]])
                )
            );

        } catch (error) {
            setSaveErrored(true);
            console.error(error);
        }
    }

    // handler for deleting the current note
    const handleDelete = async () => {
        if (currNote && currNote._id) {
            try {
                const res = await fetch(`/api/notes/${currNote._id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });
                const resData: APIResponseData<string> = await res.json();
                if (resData.status === "error") {
                    console.error(`Error: ${resData.message}`);
                } else {
                    console.log(resData.resData);

                    // remove from client side
                    setNotes(prevMap =>
                        new Map(
                            [...prevMap.entries()].filter(
                                (entry) => entry[0] !== currNote._id
                            )
                        )
                    );
                    setCurrNote(undefined);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCurrNote(undefined);
        }
    }

    // handler for category dropdown menu's checkboxes click
    const handleCategoryClick: MouseEventHandler<HTMLInputElement> = (e) => {
        setIsSaved(false);
        const categoryId = e.currentTarget.id;
        if (!currNote) { return }
        const noteInCategory = currNote.categoryIds.includes(categoryId);

        // if note in category clicked, then remove it, otherwise add it
        if (noteInCategory) {
            const updatedIds = currNote.categoryIds.filter(id => id !== categoryId);
            setCurrNote({...currNote, categoryIds: updatedIds});
        } else {
            const updatedIds = [...currNote.categoryIds, categoryId];
            setCurrNote({...currNote, categoryIds: updatedIds});
        }
        
    }

    // function to check if category dropdown's category should be checked
    const isCategoryChecked = (category: CategoryData) => {
        return currNote?.categoryIds.includes(category._id) ?? false;
    }

    // special onClick functions
    const stopActionsAndPropagation: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        setIsNoteMoving(false);
    }
    const handleMoveButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        setIsNoteMoving(prev => !prev);
    }
    
    // change event handlers: set unsaved state and word counter
    const handleTitleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setUnsaved();
        setTitleLength(e.target.value.length);
    }
    const handleBodyChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setUnsaved();
        setBodyLength(e.target.value.length);
    }

    // blur event handlers: update currNote fields
    const handleTitleBlur: FocusEventHandler<HTMLTextAreaElement> = (e) => {
        if (currNote) {
            setCurrNote({ ...currNote, title: e.target.value})
        }
    }
    const handleBodyBlur: FocusEventHandler<HTMLTextAreaElement> = (e) => {
        if (currNote) {
            setCurrNote({ ...currNote, body: e.target.value})
        }
    }

    // load note details on update
    useEffect(() => {
        const titleTextArea = document.getElementById("title-ta") as HTMLTextAreaElement;
        const bodyTextArea = document.getElementById("body-ta") as HTMLTextAreaElement;

        const newTitleString = currNote?.title ?? "";
        const newBodyString = currNote?.body ?? "";

        titleTextArea.value = newTitleString;
        bodyTextArea.value = newBodyString;

        setTitleLength(newTitleString.length);
        setBodyLength(newBodyString.length);
        setSaveErrored(false);
    }, [currNote]);

    // details to change only when switching, not updating notes
    useEffect(() => {
        setIsSaved(!!currNote?._id); // save when opening old note but not when creating new note
        setIsNoteMoving(false);
        setShowCatDropdown(false);
    }, [currNote?._id]);    

    // remove save error msg when save status is updated
    useEffect(() => {
        setSaveErrored(false);
    }, [isSaved]);

    return (
        
        <div className={`bg-backgroundlight w-full h-full transition-all ease-in-out duration-400
                        ${currNote ? "max-w-sm" : "max-w-0"}`}
            onClick={stopActionsAndPropagation}>{/* moving div container */}

            {/* content opacity transition container */}
            <div className={`flex flex-col w-full h-full items-start gap-y-2 p-2 relative overflow-x-hidden overflow-y-auto
                            transition-opacity ease-reciprocal duration-400 ${currNote ? "opacity-100" : "opacity-0"}`}>

                {/* key details sticky container */}
                <div className="flex flex-col w-full px-2 py-1 mb-1 rounded-xl sticky top-1 bg-background contrast-text shadow-md shadow-background z-50" 
                        hidden={!currNote} onClick={stopActionsAndPropagation}>
                    
                    {/* title and X button */}
                    <div className="flex flex-row w-full align-top note-menu-title-gap mb-1">
                        <div className="flex flex-col note-menu-title-grow h-auto">
                            <h3 className="w-full h-auto">
                                <textarea className="w-full max-w-full resize-y min-h-14.5 max-h-40 border-b border-solid" id="title-ta" maxLength={60}
                                        placeholder="Untitled Note" defaultValue={currNote ? currNote.title : ""} onChange={handleTitleChange} onBlur={handleTitleBlur}/>
                            </h3>
                            <p className="text-foreground text-sm">{`${titleLength}/60`}</p>
                        </div>
                        <button onClick={() => setCurrNote(undefined)}
                            className="note-menu-x-size p-1.5 rounded-full hover:bg-foreground/20 text-foreground">
                            <LuX className="w-full h-full"/>
                        </button>
                    </div>


                    {/* saving details */}
                    <div className="flex flex-row w-full justify-between items-center">
                        <div className="flex flex-col gap-0.5">
                            <p className="italic text-foreground">{isSaved ? "All changes saved" : "Unsaved changes"}</p>
                            {saveErrored && <p className="text-xs text-bad">Error occurred while saving. Please try again.</p>}
                        </div>
                        <button onClick={handleSave} className="fit-pill-button bg-primary hover:bg-secondary font-semibold contrast-text">
                            {currNote?._id ? "Save" : "Create"}
                        </button>
                    </div>
                </div>

                {/* time created and updated */}
                <div>
                    <h6 className="contrast-text font-semibold" hidden={!currNote}>
                        {`Created: ${dateCreated?.toLocaleDateString()} (${dateCreated?.toLocaleTimeString()})`}
                    </h6>
                    <h6 className="contrast-text font-semibold" hidden={!currNote}>
                        {`Last updated: ${dateUpdated?.toLocaleDateString()} (${dateUpdated?.toLocaleTimeString()})`}
                    </h6>
                </div>
                
                {/* location container */}
                <div className="flex flex-row w-full justify-between items-center" hidden={!currNote}>
                    <p>{currNote?.location.coordinates[0].toFixed(6)}, {currNote?.location.coordinates[1].toFixed(6)}</p>
                    <button onClick={handleMoveButtonClick} 
                            className={`fit-pill-button font-semibold contrast-text 
                                        ${isNoteMoving ? "bg-bad hover:bg-badmed" : "bg-primary hover:bg-secondary" }`}>
                        {isNoteMoving ? "Cancel" : "Move"}
                    </button>
                </div>

                {/* categories container */}
                <div className="flex flex-wrap w-full px-1 gap-2" hidden={!currNote}>
                    {Array.from(categories.values()).map(
                        (category) => {
                            if (!currNote?.categoryIds.includes(category._id)) {
                                return null;
                            }

                            return (
                                <div className="flex flex-row category-card w-fit max-w-full h-fit gap-1" key={category._id}>
                                    <div className={`rounded-full w-3 min-w-3 h-3 border-neutral-900 border-solid border`} style={{ backgroundColor: category.color }}></div>
                                    <p className="text-neutral-900 w-fit max-w-full h-fit mr-0.5 wrap-break-word">{category.name}</p>
                                </div>
                            );
                        }
                    )}
                    <div className="flex relative w-fit h-fit justify-center items-center">
                        <button onClick={() => setShowCatDropdown(prev => !prev)}
                                className="flex flex-row fit-pill-button w-auto gap-1 bg-primary hover:bg-secondary">
                            <LuPlus className="contrast-text" />
                            <p className="font-semibold contrast-text cursor-pointer">Add category</p>
                        </button>
                        <CategoryDropdown showDropdown={showCatDropdown} setShowDropdown={setShowCatDropdown} 
                                          handleCategoryClick={handleCategoryClick} isCategoryChecked={isCategoryChecked} 
                                          defaultHeight="8rem" defaultWidth="10rem"/>
                    </div>
                </div>
                
                {/* image container (placeholder) */}
                <div className="w-full min-h-60 bg-primary rounded-2xl" hidden={!currNote}></div>

                {/* body */}
                <div className="flex flex-col w-full max-w-full gap-y-1" hidden={!currNote}>
                    <textarea className="w-full max-w-full resize-none rounded-2xl p-1.5 border-2 border-solid border-foreground contrast-text" id="body-ta"
                            placeholder="Write a note..." defaultValue={currNote ? currNote.body : ""} maxLength={2500}
                            onChange={handleBodyChange} onBlur={handleBodyBlur}/>
                    <p className="w-full text-right text-foreground text-sm">{`${bodyLength}/2500`}</p>
                </div>
                
                {/* delete button */}
                <div className="flex w-full max-w-full h-fit justify-center items-center my-1" hidden={!currNote}>
                    <button className="flex flex-row fit-pill-button w-auto gap-1 bg-bad hover:bg-badmed"
                            onClick={handleDelete}>
                        <LuTrash2 className="contrast-text" />
                        <p className="font-semibold contrast-text text-sm">Delete Note</p>
                    </button>
                </div>

            </div>
        </div>
    );
}