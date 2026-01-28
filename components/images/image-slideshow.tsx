import { Image, UploadResponse } from "@imagekit/next";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { UploadMenu } from "./image-upload";
import { MapStatesContext } from "../map/map";
import { LuChevronLeft, LuChevronRight, LuTrash2 } from "react-icons/lu";
import { ConfirmDeleteModal } from "../modals/modals";

interface ImageSSProps{
    currImageLinks: string[]
    setCurrImageLinks: Dispatch<SetStateAction<string[]>>
    hidden: boolean
}

// image slideshow for note menu
export function ImageSlideShow({ currImageLinks, setCurrImageLinks, hidden }: ImageSSProps) {
    const { currNote, setIsSaved } = useContext(MapStatesContext);
    const [slideNum, setSlideNum] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // function to handle successful photo upload
    const handleUploadSuccess = (upRes: UploadResponse) => {
        if (upRes.filePath) {
            const filePath = upRes.filePath;
            setCurrImageLinks(curr => [...curr, filePath]);
            setIsSaved(false);
        }
    }

    // handle navigation buttons
    const handlePrevNav = () => {
        let newSlide = slideNum - 1;
        if (newSlide < 0) {
            newSlide += (currImageLinks.length + 1);
        }
        setSlideNum(newSlide);
    }
    const handleNextNav = () => {
        setSlideNum(curr => ((curr + 1) % (currImageLinks.length + 1)));
    }

    // handle delete button
    const handleDeleteImage = () => {
        if (slideNum >= 0 && slideNum < currImageLinks.length) {
            setCurrImageLinks(prev => [...prev.slice(0, slideNum), ...prev.slice(slideNum + 1)]);
            setShowDeleteModal(false);
            setIsSaved(false);
        }
    }

    // reset to first slide on changing notes, and get images
    useEffect(() => {
        setSlideNum(0);
    }, [currNote?._id]);

    return (
        <div className="flex items-center justify-center w-full aspect-square bg-background relative" hidden={hidden}>
            {/* ^^^slideshow container */}

            {/*images slideshow*/}
            {currImageLinks.map((link, i) =>
                <div className={`absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center p-2  
                                transition-opacity duration-500 ${(i === slideNum) ? "opacity-100" : "opacity-0"}`}
                     key={i}>
                    <Image className="size-full min-size-full object-contain"
                        src={link} alt={`Picture ${i + 1}`} width={400} height={400}
                    />
                    <p className="absolute bottom-0.5 p-1 text-center bg-neutral-900/60 contrast-text">
                        {i + 1}/{currImageLinks.length}
                    </p>
                </div>
            )}

            {/* image upload on last slide */}
            <div className={`size-full flex items-center justify-center p-2 relative 
                            transition-opacity duration-500 ${(slideNum === currImageLinks.length) ? "opacity-100" : "opacity-0"}`}>
                {currNote?._id ? 
                    <UploadMenu currImageLinks={currImageLinks} handleUploadSuccess={handleUploadSuccess} resetMsgDependencies={[slideNum]}
                            folderPathFromUser={`${currNote?._id ?? ""}`}/>
                    : <div className="flex flex-col h-fit max-size-full gap-1 m-1 input-field">
                        <h5 className="text-neutral-900 font-semibold text-center">Please create the note to add images</h5>
                    </div>
                
                }
                <p className="absolute bottom-0.5 p-1 text-center bg-neutral-900/60 contrast-text">
                    ++/{currImageLinks.length}
                </p>
            </div>

            {/* delete, forward, and back buttons */}
            <button className="absolute top-1 right-1 w-7 aspect-square rounded-full flex items-center justify-center p-1 
                            bg-neutral-900/60 hover:bg-neutral-600/60 transition-colors contrast-text"
                    onClick={() => setShowDeleteModal(true)} hidden={slideNum === currImageLinks.length}>
                <LuTrash2 className="size-full" />
            </button>
            <button className="absolute left-1 w-10 aspect-square rounded-full flex items-center justify-center p-1 
                            bg-neutral-900/60 hover:bg-neutral-600/60 transition-colors contrast-text"
                    onClick={handlePrevNav}>
                <LuChevronLeft className="size-full" />
            </button>
            <button className="absolute right-1 w-10 aspect-square rounded-full flex items-center justify-center p-1 
                            bg-neutral-900/60 hover:bg-neutral-600/60 transition-colors contrast-text"
                    onClick={handleNextNav}>
                <LuChevronRight className="size-full" />
            </button>

            {/* delete modal */}
            {showDeleteModal &&
                <ConfirmDeleteModal 
                    objectDesc={`the current image`}
                    handleDelete={handleDeleteImage}
                    closeModal={() => setShowDeleteModal(false)}
                    warningMsg="Once the note gets saved the image will be gone forever!"
                />
            }

        </div>
        
    );
}