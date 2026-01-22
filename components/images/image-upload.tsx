"use client";
import { auth } from "@/auth";
import { IKAuthData, SubmitMsg } from "@/interfaces/data";
import { APIResponseData } from "@/interfaces/responses";
import { ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError, upload, UploadResponse } from "@imagekit/next";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { MapStatesContext } from "../map/map";

interface UploadMenuProps{
    currImageLinks?: string[]
    handleUploadSuccess: (upRes: UploadResponse) => void
    resetMsgDependencies?: any[]
}

// some code taken from ImageKit NextJS docs
export function UploadMenu ({ currImageLinks, handleUploadSuccess, resetMsgDependencies }: UploadMenuProps) {
    const [progress, setProgress] = useState(0);
    const [submitMsg, setSubmitMsg] = useState<SubmitMsg>({ message: "", ok: "bad" });
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { currNote } = useContext(MapStatesContext);

    // reset submit message
    useEffect(() => {
        setSubmitMsg({ message: "", ok: "bad" });
    }, resetMsgDependencies);

    if (!currNote?._id) {
        // if no note or new note, disable adding pictures
        return (
            <div className="flex flex-col h-fit max-size-full gap-1 m-1 input-field">
                <h5 className="text-neutral-900 font-semibold text-center">Please create the note to add images</h5>
            </div>
        );
    }

    resetMsgDependencies = resetMsgDependencies ?? [];

    // function to get auth details
    const getAuth = async (): Promise<IKAuthData | null> => {
        try {
            // Perform the request to the upload authentication endpoint.
            const res = await fetch("/api/upload-auth");
            const resData: APIResponseData<IKAuthData> = await res.json();

            if (resData.status === "error") {
                setSubmitMsg({ message: "Upload error, please try again", ok: "bad" });
                console.error()
                return null;
            }
            return resData.resData;
        } catch (error) {
            console.error("Authentication error:", error);
            return null;
        }
    };

    const handleUpload = async () => {
        // get userId
        // Access the file input element using the ref
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            console.log(fileInput);
            setSubmitMsg({ message: "Please select a file to upload", ok: "bad"});
            return;
        } else if (currImageLinks && currImageLinks.length >= 12) {
            setSubmitMsg({ message: "Max 12 images per note", ok: "bad"});
            return;
        }

        // Extract the first file from the file input
        const file = fileInput.files[0];

        if (file.size >= 5 * 1024 * 1024) {
            setSubmitMsg({ message: "Max 5MB image upload", ok: "bad"});
            return;
        } else if (!file.type.startsWith("image/")) {
            setSubmitMsg({ message: "Invalid image format", ok: "bad"});
            return;
        }

        // Retrieve authentication parameters for the upload.
        const authParams = await getAuth();
        if (authParams == null) { return }
        const { signature, expire, token, publicKey, userId } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                useUniqueFileName: true,
                folder: `/projects/geojournal/${userId}/${currNote?._id ?? ""}`,
                // Progress callback to update upload progress state
                onProgress: (e) => {
                    setProgress((e.loaded / e.total) * 100);
                },
            });

            console.log("Upload response:", uploadResponse);
            handleUploadSuccess(uploadResponse);
            fileInput.files = null;
            setFileName("");

        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK. (code from IK docs)
            setSubmitMsg({ message: "Upload error, please try again", ok: "bad" });
            
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                console.error("Upload error:", error);
            }
        }
    };

    return (
        <div className="flex flex-col h-fit max-size-full gap-1 m-1 input-field">
            <div className="flex flex-row w-fit max-w-full gap-2 items-center justify-center">
                <label htmlFor="addFile" className="fit-pill-button bg-primary hover:bg-secondary transition-colors contrast-text font-semibold shrink-0">
                    Choose file
                </label>
                <p>{fileName ? fileName : "No file selected"}</p>
            </div>
            <input type="file" id="addFile" ref={fileInputRef} hidden={true} accept="image/*"
                   onChange={(e) => setFileName(e.currentTarget.files?.item(0)?.name ?? "")} />
            <div className="flex flex-row size-fit">
                <button className="fit-pill-button bg-primary hover:bg-secondary transition-colors font-semibold contrast-text"
                        onClick={handleUpload}>
                    Upload
                </button>
            </div>

            {submitMsg.message &&
                <p className={`text-${submitMsg.ok} text-xs`}>{submitMsg.message}</p>
            }
            {(progress > 0 && progress < 100) &&
                <>Upload progress: {progress.toFixed(2)}% <progress value={progress} max={100}></progress></>
            }
        </div>
    );
}