import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { ModalWrapper } from "./modal-utilities";
import { UploadMenu } from "../images/image-upload";
import { UploadResponse } from "@imagekit/next";

// SPECIFIC MODALS

// delete confirmation modal
interface DeleteModalProps{
    objectDesc: string
    handleDelete: MouseEventHandler<HTMLButtonElement>
    closeModal: () => void
    warningMsg?: string
}

// delete confirmation modal
interface UploadPhotoProps{
    destination?: string
    closeModal: () => void
    imageLinks: string[]
    handleUploadSuccess: (upRes: UploadResponse) => void
    _fileName?: string
}

export function ConfirmDeleteModal({ objectDesc, handleDelete, closeModal, warningMsg }: DeleteModalProps) {

    return (
        <ModalWrapper closeModal={closeModal}>
            <div className="flex flex-col w-2xs h-fit rounded-xl items-center p-4 gap-2 
                            bg-background border-foreground border-solid border-3"
                  onClick={(e) => e.stopPropagation()}>
                <h5 className="contrast-text max-w-full">Confirm Delete</h5>
                <p className="text-center max-w-full wrap-break-word">
                    Are you sure you want to delete the {objectDesc}? 
                    <br/> <span className="font-bold contrast-text">{ warningMsg ?? "This cannot be undone!"}</span>
                </p>
                <div className="flex flex-row w-3/5 min-w-fit max-w-full h-fit justify-between">
                    <button className="bg-border-frame fit-pill-button w-auto font-semibold transition-colors"
                            onClick={closeModal}>
                        Cancel
                    </button>
                    <button className="fit-pill-button w-auto font-semibold contrast-text bg-bad hover:bg-badmed transition-colors"
                            onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
}

export function UploadPhotoModal({ destination = "", closeModal, imageLinks, handleUploadSuccess, _fileName }: UploadPhotoProps) {

    return (
        <ModalWrapper closeModal={closeModal}>
            <div className="flex flex-col w-fit h-fit rounded-xl items-center p-4 gap-2 
                            bg-background border-foreground border-solid border-3"
                  onClick={(e) => e.stopPropagation()}>
                <UploadMenu currImageLinks={imageLinks} handleUploadSuccess={handleUploadSuccess}
                            folderPathFromUser={`${destination}`} _fileName={_fileName} _useUniqueName={false}/>
            </div>
        </ModalWrapper>
    );
}