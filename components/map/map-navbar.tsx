import { LuChevronRight, LuHexagon, LuSlidersHorizontal } from "react-icons/lu";
import { HomeTextButton, SettingsButton } from "../page-buttons";
import { Dispatch, MouseEventHandler, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { CategoryDropdown } from "./category-dropdown";
import { MapStatesContext } from "./map";
import { CategoryData } from "@/interfaces/data";


export function MapNavbar() {
    const { categories, keptCategoryIds, setKeptCategoryIds, showAllNotes, setShowAllNotes } = useContext(MapStatesContext);
    const [expandLeft, setExpandLeft] = useState(true); // whether left side bar is expanded or not
    const [showNavCatDropdown, setShowNavCatDropdown] = useState(false);

    // handle category click: filtering
    const handleCategoryClick: MouseEventHandler<HTMLInputElement> = (e) => {
        const categoryId = e.currentTarget.id;
        const categoryKept = keptCategoryIds.includes(categoryId);

        // if category wasn't filtered away, then filter it, otherwise add it back
        if (categoryKept) {
            setKeptCategoryIds(prev => prev.filter(id => id !== categoryId));
            setShowAllNotes(false);
        } else {
            setKeptCategoryIds(prev => [...prev, categoryId]);
        }
    }

    const isCategoryChecked = (category: CategoryData) => {
        return keptCategoryIds.includes(category._id);
    }

    const selectAllFunction = (selectedAll: boolean, setSelectAll: Dispatch<SetStateAction<boolean>>) => {
        const handleSelectAll: MouseEventHandler<HTMLButtonElement> = () => {
            if (selectedAll) {
                setKeptCategoryIds([]);
                setShowAllNotes(false);
            } else {
                setKeptCategoryIds([...categories.keys()]);
                setShowAllNotes(true);
            }
            setSelectAll(prev => !prev);
        }
        return handleSelectAll;
    }

    // update dropdowns when expanding is closed
    useEffect(() => {
        setShowNavCatDropdown(prev => (prev && expandLeft));
    }, [expandLeft]);

    return (
        <div className="flex flex-row w-full max-w-full h-fit p-1 justify-between absolute top-0
                        bg-linear-to-b from-neutral-900/70 to-neutral-900-50">

            {/* sliding navbar */}
            <div className="flex flex-row w-fit max-w-[calc(100vw-4rem)] h-fit py-1 items-center gap-2 mr-1.5 shrink">

                {/* container for navbar buttons */}
                <div className={`flex flex-row w-fit h-fit max-h-12 items-center gap-2 p-1
                        transition-all ${ expandLeft ? "max-w-full overflow-x-auto" : "max-w-0 overflow-x-hidden" }`}>
                    
                    {/* border div for left line */}
                    <div className="border-solid border-2 border-foreground h-10" />

                    {/* home page button */}
                    <HomeTextButton />

                    {/* category filter button */}
                    <div className="flex relative w-fit h-fit justify-center items-center dropdown-button">
                        <button onClick={() => setShowNavCatDropdown(prev => !prev)}
                                className="flex flex-row bg-border-frame items-center justify-center w-60 min-w-fit gap-3 p-1.5 h-10 rounded-full transition-colors">
                            <LuSlidersHorizontal className="contrast-text text-lg" />
                            <p className="font-semibold contrast-text cursor-pointer text-lg">Categories</p>
                        </button>
                    </div>

                    {/* visualize data button */}
                    <div className="flex w-fit h-fit justify-center items-center">
                        <a href="/visualize"
                                className="flex flex-row bg-border-frame items-center justify-center w-fit min-w-fit gap-2 px-2.5 py-1 h-10 rounded-full transition-colors">
                            <LuHexagon className="contrast-text text-lg" />
                            <p className="font-semibold contrast-text cursor-pointer text-lg">Visualize</p>
                        </a>
                    </div>

                </div>

                {/* expand/collapse navbar button */}
                <button className="w-8 h-8 aspect-square bg-border-frame transition-colors rounded-full p-1.5"
                        onClick={() => setExpandLeft(prev => !prev)}>
                    <LuChevronRight className={`w-full h-full ${expandLeft ? "rotate-y-180" : ""}`}/>
                </button>
            </div>

            <SettingsButton />
            {/* category dropdown removed out */}
            <div className="absolute dropdown-anchoring">
                <CategoryDropdown showDropdown={showNavCatDropdown} setShowDropdown={setShowNavCatDropdown} 
                                handleCategoryClick={handleCategoryClick} isCategoryChecked={isCategoryChecked}
                                includeDeleteMode selectAllFunction={selectAllFunction} defaultHeight="10rem" defaultWidth="15rem"/>
            </div>
        </div>
    );
}