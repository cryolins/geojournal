import { CategoryData, NoteData } from "@/interfaces/data";
import { Dispatch, MouseEventHandler, SetStateAction, useContext } from "react";
import { MapStatesContext } from "./map";


interface dropdownProps{
    showDropdown: boolean 
    setShowDropdown: Dispatch<SetStateAction<boolean>>
}

export function CategoryDropdown({ showDropdown, setShowDropdown }: dropdownProps) {

    // getting MapStatesContext
    const {
        currNote, setCurrNote, isSaved, setIsSaved, isNoteMoving, setIsNoteMoving, 
        categories, setCategories, notes, setNotes
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

    return (
        <div className={`flex flex-col items-center w-40 max-w-40 h-32 absolute top-9 rounded-sm bg-field border-solid border-foreground 
                        transition-all duration-200 ${showDropdown ? "max-h-32 p-1 border-2" : "max-h-0" }`}
                        onClick={(e) => e.stopPropagation()}> {/* size scaling container */}
            
            {/* opacity scaling container */}
            <div className={`flex flex-col w-full h-full overflow-x-hidden overflow-y-auto
                            transition-opacity ease-reciprocal duration-200 ${currNote ? "opacity-100" : "opacity-0"}`}
                onBlur={() => setShowDropdown(false)}>
                
                

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