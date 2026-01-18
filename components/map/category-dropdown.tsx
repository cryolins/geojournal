import { CategoryData, NoteData } from "@/interfaces/data";
import { Dispatch, MouseEventHandler, SetStateAction, useContext, useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { MapStatesContext } from "./map";
import { CategoryEditor } from "./category-editor";


interface dropdownProps{
    showDropdown: boolean 
    setShowDropdown: Dispatch<SetStateAction<boolean>>
}

export function CategoryDropdown({ showDropdown, setShowDropdown }: dropdownProps) {
    const [showEditor, setShowEditor] = useState(false);

    // getting MapStatesContext
    const {
        currNote, setCurrNote, setIsSaved, categories
    } = useContext(MapStatesContext);

    const handleCategoryClick: MouseEventHandler<HTMLInputElement> = (e) => {
        setIsSaved(false);
        const categoryId = e.currentTarget.id;
        if (!currNote) { return }
        const noteInCategory = currNote.categoryIds.includes(categoryId)

        // if note in category clicked, then remove it, otherwise add it
        if (noteInCategory) {
            const updatedIds = currNote.categoryIds.filter(id => id !== categoryId);
            setCurrNote({...currNote, categoryIds: updatedIds});
        } else {
            const updatedIds = [...currNote.categoryIds, categoryId];
            setCurrNote({...currNote, categoryIds: updatedIds});
        }
        
    }

    // update editor showing based on showDropdown when it updates
    useEffect(() => {
        setShowEditor(prev => (prev && showDropdown));
    }, [showDropdown]);

    return (
        <div className={`items-center w-40 max-w-40 h-32 absolute top-9 rounded-sm bg-field border-solid border-foreground 
                        transition-all duration-200 ${showDropdown ? "max-h-32 p-1 border-2" : "max-h-0" }`}
                        onClick={(e) => e.stopPropagation()}> {/* size scaling container */}
            
            {/* opacity scaling container */}
            <div className={`flex flex-col w-full h-full overflow-x-hidden overflow-y-auto
                            transition-opacity ease-reciprocal duration-200 ${showDropdown ? "opacity-100" : "opacity-0"}`}
                >
                
                {/* new category button */}
                <div className="flex w-full max-w-full h-fit justify-center items-center">
                    <button className="flex flex-row fit-pill-button w-auto gap-1 relative bg-primary hover:bg-secondary"
                            onClick={() => setShowEditor(prev => !prev)}>
                        <LuPlus className="contrast-text" />
                        <p className="font-semibold contrast-text cursor-default">New</p>
                    </button>
                </div>

                {/* category editor */}
                {showEditor && <CategoryEditor absPosString="top-32.5 -left-0.5" categoryId="" showEditor={showEditor} setShowEditor={setShowEditor}/>}

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
                            <h6 className="text-neutral-900">{category.name}</h6>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}