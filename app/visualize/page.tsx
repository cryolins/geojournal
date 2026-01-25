import { HomeTextButton, NotesMapButton, SettingsButton } from "@/components/page-buttons";
import VisualizeClientWrapper from "@/components/visualize/visualize-wrapper";


export default function VisualizePage() {
    return(
        <div className="w-full h-screen">
            <VisualizeClientWrapper />
            <div className="flex flex-row w-full h-fit p-1 gap-2 items-center justify-center sm:justify-end absolute top-0">
                <HomeTextButton />
                <NotesMapButton />
                <SettingsButton />
            </div>
        </div>
    );
};