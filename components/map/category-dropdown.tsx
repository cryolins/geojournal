import { CategoryData, NoteData } from "@/interfaces/data";
import { Dispatch, MouseEventHandler, SetStateAction, useContext, useEffect, useState } from "react";
import { LuPlus, LuSquarePen, LuTrash2 } from "react-icons/lu";
import { MapStatesContext } from "./map";
import { CategoryEditor } from "./category-editor";
import { APIResponseData } from "@/interfaces/responses";
import { ConfirmDeleteModal } from "../modals/modals";


interface dropdownProps{
    showDropdown: boolean 
    setShowDropdown: Dispatch<SetStateAction<boolean>>
    handleCategoryClick: MouseEventHandler<HTMLInputElement>
    isCategoryChecked: (category: CategoryData) => boolean
    defaultHeight: string
    defaultWidth: string
    includeDeleteMode?: boolean
    selectAllFunction?: (selectedAll: boolean, setSelectAll: Dispatch<SetStateAction<boolean>>) => MouseEventHandler<HTMLButtonElement>
}

export function CategoryDropdown({ showDropdown, handleCategoryClick, isCategoryChecked, 
                                   defaultHeight, defaultWidth, includeDeleteMode, selectAllFunction }: dropdownProps) {
    includeDeleteMode = includeDeleteMode ?? false;
    const [showEditor, setShowEditor] = useState(false);
    const [inDeleteMode, setInDeleteMode] = useState(false);
    // simply the state for the button, not indicative of what categories have been selected
    const [selectedAll, setSelectAll] = useState(true);  
    const [editorId, setEditorId] = useState("");
    const [deleteModalId, setDeleteModalId] = useState<string>(""); // empty string = off

    // getting MapStatesContext
    const { categories, setCategories } = useContext(MapStatesContext);

    // update some values based on showDropdown when it updates
    useEffect(() => {
        setShowEditor(prev => (prev && showDropdown));
        setInDeleteMode(prev => (prev && showDropdown));
    }, [showDropdown]);

    // edit button handler
    const handleEditClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        setEditorId(e.currentTarget.id);
        setShowEditor(true);
    }

    // wrapper for handleDelete, to pass into ConfirmDeleteModal
    const handleDeleteWrapper = (id: string) => {
        // delete handler
        const handleDelete: MouseEventHandler<HTMLButtonElement> = () => {
            setCategories(prevMap =>
                    new Map(
                        [...prevMap.entries()].filter(
                            (entry) => entry[0] !== id
                        )
                    )
                );
            const sendDelete = async () => {
                try {
                    const res = await fetch(`/api/categories/${id}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });
                    const resData: APIResponseData<string> = await res.json();
                    if (resData.status === "error") {
                        console.error(`Error: ${resData.message}`);
                    } else {
                        console.log(resData.resData);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            sendDelete();
            setDeleteModalId("");
        }
        return handleDelete;
    }

    return (
        <div className={`flex flex-col items-center w-fit h-fit absolute top-full mt-1 gap-1 z-6`}>
            {/* ^wrapper container for dropdown and related menus like editor*/}

            {/* category dropdown list container */}
            <div className={`items-center max-w-full rounded-sm bg-background border-solid border-foreground 
                            transition-all duration-200 ${showDropdown ? "p-1 border-2 resize-y" : "" }`}
                            style={{ width: defaultWidth, height: defaultHeight, maxHeight: (showDropdown ? defaultHeight : "0px") }} 
                            onClick={(e) => e.stopPropagation()}> 
                
                {/* opacity scaling container */}
                <div className={`flex flex-col w-full h-full overflow-x-hidden overflow-y-auto
                                transition-opacity ease-reciprocal duration-200 ${showDropdown ? "opacity-100" : "opacity-0"}`}>
                    
                    {/* new category button */}
                    <div className="flex w-full max-w-full h-fit justify-center items-center">
                        <button className="flex flex-row fit-pill-button w-auto gap-1 bg-primary hover:bg-secondary"
                                onClick={() => setShowEditor(prev => !prev)}>
                            <LuPlus className="contrast-text" />
                            <p className="font-semibold contrast-text">New</p>
                        </button>
                    </div>

                    {/* delete mode toggle button */}
                    {includeDeleteMode &&
                        <div className="flex w-full max-w-full h-fit justify-center items-center my-1">
                            <button className="flex flex-row fit-pill-button w-auto gap-1 bg-bad hover:bg-badmed"
                                    onClick={() => setInDeleteMode(prev => !prev)}>
                                <LuTrash2 className="contrast-text" />
                                <p className="font-semibold contrast-text text-sm">Toggle Delete</p>
                            </button>
                        </div>
                    }

                    {/* (de/)select or show/hide all button */}
                    {selectAllFunction &&
                        <div className="flex w-full max-w-full h-fit justify-center items-center my-1">
                            <button className={`flex flex-row fit-pill-button w-auto gap-1 ${selectedAll ? "bg-bad hover:bg-badmed" : "bg-primary hover:bg-secondary"} font-semibold contrast-text text-sm`}
                                    onClick={selectAllFunction(selectedAll, setSelectAll)}>
                                {selectedAll ? "Hide All" : "Show All"}
                            </button>
                        </div>
                    }

                    {/* categories listed */}
                    {Array.from(categories.values()).map((category) => {
                        const checked = isCategoryChecked(category);

                        return(
                            <div className="flex flex-row w-full max-w-full h-fit items-center justify-between" key={category._id}>

                                <div className={`flex flex-row w-fit h-fit gap-1 items-center ${inDeleteMode ? "max-w-17/20" : "max-w-full"}`}>
                                    {/* checkbox */}
                                    <div className="items-center justify-center border border-solid w-4 h-4 relative" style={{ borderColor: category.color }}>
                                        <input className="top-0 bottom-0 left-0 right-0 border border-solid border-neutral-50 absolute" 
                                                type="checkbox" id={category._id} onClick={handleCategoryClick} 
                                                style={{ 
                                                    accentColor: category.color, 
                                                    backgroundColor: checked ? category.color : "transparent"
                                                }}/>
                                    </div>

                                    <button className="w-4 h-4 min-w-4 min-h-4" id={category._id} onClick={handleEditClick}>
                                        <LuSquarePen className="w-full h-full text-primary hover:text-secondary" />
                                    </button>

                                    {/* category name */}
                                    <p className="contrast-text wrap-break-word max-w-7/10">{category.name}</p>
                                </div>

                                {/* delete button */}
                                {inDeleteMode &&
                                    <div className="w-fit h-fit" id={category._id}>
                                        <button className="w-4 h-4 min-w-4 min-h-4" onClick={() => setDeleteModalId(category._id)}>
                                            <LuTrash2 className="w-full h-full text-bad hover:text-badmed transition-colors" />
                                        </button>

                                        {/* delete modal */}
                                        {(deleteModalId === category._id) &&
                                            <ConfirmDeleteModal 
                                                objectDesc={`category: ${category.name}`}
                                                handleDelete={handleDeleteWrapper(category._id)}
                                                closeModal={() => setDeleteModalId("")}
                                            />
                                        }
                                    </div>
                                }

                            </div>
                        );

                    })}
                </div>
            </div>

            {/* category editor */}
            {showEditor && <CategoryEditor categoryId={editorId} showEditor={showEditor} setShowEditor={setShowEditor}/>}
        
        </div>
    );
}