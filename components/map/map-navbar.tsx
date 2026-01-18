import { LuChevronRight } from "react-icons/lu";
import { SettingsButton } from "../page-buttons";
import { useState } from "react";


export function MapNavbar() {
    const [expandLeft, setExpandLeft] = useState(true); // whether left side bar is expanded or not

    return (
        <div className="flex flex-row w-full h-fit p-1 justify-between overflow-hidden absolute top-0
                        bg-linear-to-b from-neutral-900/70 to-neutral-900-50">

            {/* sliding navbar */}
            <div className="flex flex-row w-fit max-w-full h-fit items-center gap-2 mr-1.5">
                <div className={`flex flex-row w-fit h-fit items-center gap-2 p-1 
                        transition-all ${ expandLeft ? "max-w-full overflow-x-auto" : "max-w-0 overflow-x-hidden" }`}>
                    <div className="w-60 h-10 bg-border-frame"></div>
                    <div className="w-60 h-10 bg-border-frame"></div>
                </div>
                <button className="w-8 h-8 aspect-square bg-border-frame transition-colors rounded-full p-1.5"
                        onClick={() => setExpandLeft(prev => !prev)}>
                    <LuChevronRight className={`w-full h-full ${expandLeft ? "rotate-y-180" : ""}`}/>
                </button>
            </div>

            <SettingsButton />
        </div>
    );
}