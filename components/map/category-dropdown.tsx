import { CategoryData, NoteData } from "@/interfaces/data";
import { Dispatch, MouseEventHandler, SetStateAction, useContext, useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { MapStatesContext } from "./map";
import { CategoryEditor } from "./category-editor";


interface dropdownProps{
    showDropdown: boolean 
    setShowDropdown: Dispatch<SetStateAction<boolean>>
    handleCategoryClick: MouseEventHandler<HTMLInputElement>
    defaultHeight: string
}

export function CategoryDropdown({ showDropdown, handleCategoryClick, defaultHeight }: dropdownProps) {
    const [showEditor, setShowEditor] = useState(false);

    // getting MapStatesContext
    const {
        currNote, setCurrNote, setIsSaved, categories
    } = useContext(MapStatesContext);

    // update editor showing based on showDropdown when it updates
    useEffect(() => {
        setShowEditor(prev => (prev && showDropdown));
    }, [showDropdown]);

    return (
        <div className={`flex flex-col items-center w-fit h-fit absolute top-full mt-1 gap-1`}>
            {/* ^wrapper container for dropdown and related menus like editor*/}

            {/* category dropdown list container */}
            <div className={`items-center w-40 max-w-full rounded-sm bg-field border-solid border-foreground 
                            transition-all duration-200 ${showDropdown ? "p-1 border-2" : "" }`}
                            style={{ height: defaultHeight, maxHeight: (showDropdown ? defaultHeight : "0px") }} 
                            onClick={(e) => e.stopPropagation()}> 
                
                {/* opacity scaling container */}
                <div className={`flex flex-col w-full h-full overflow-x-hidden overflow-y-auto
                                transition-opacity ease-reciprocal duration-200 ${showDropdown ? "opacity-100" : "opacity-0"}`}>
                    
                    {/* new category button */}
                    <div className="flex w-full max-w-full h-fit justify-center items-center">
                        <button className="flex flex-row fit-pill-button w-auto gap-1 relative bg-primary hover:bg-secondary"
                                onClick={() => setShowEditor(prev => !prev)}>
                            <LuPlus className="contrast-text" />
                            <p className="font-semibold contrast-text">New</p>
                        </button>
                    </div>

                    {/* categories listed */}
                    {Array.from(categories.values()).map((category) => {
                        const noteInCategory = currNote?.categoryIds.includes(category._id) ?? false;

                        return(
                            <div className="flex flex-row w-full max-w-full h-fit bg-field gap-1 items-center" key={category._id}>
                                <div className="items-center justify-center border border-solid w-4 h-4 relative" style={{ borderColor: category.color }}>
                                    <input className="top-0 bottom-0 left-0 right-0 border border-solid border-neutral-900 absolute" 
                                            type="checkbox" id={category._id} onClick={handleCategoryClick} 
                                            style={{ 
                                                accentColor: category.color, 
                                                backgroundColor: noteInCategory ? category.color : "transparent"
                                            }}/>
                                </div>
                                <h6 className="text-neutral-900 max-w-5/6 wrap-break-word">{category.name}</h6>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* category editor */}
            {showEditor && <CategoryEditor categoryId="" showEditor={showEditor} setShowEditor={setShowEditor}/>}
        
        </div>
    );
}