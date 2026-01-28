import { createContext, Dispatch, MouseEventHandler, ReactNode, SetStateAction, useContext, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps{
    children: ReactNode,
    closeModal: () => void
}

// background container and wrapper for modals
export function ModalWrapper({ children, closeModal }: ModalProps) {
    const modalRoot = document.getElementById("modal-root");

    if (modalRoot == null) {
        console.error("no modal root found");
        return null;
    }

    const handleBgClick: MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
        closeModal();
    };

    return createPortal(
        <div className="flex fixed top-0 bottom-0 left-0 right-0 bg-neutral-800/35 items-center justify-center z-100 overflow-auto"
                onClick={handleBgClick} id="modal">
            {children}
        </div>,

        modalRoot // portal destination
    );

}