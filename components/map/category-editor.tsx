import { ChangeEventHandler, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { MapStatesContext } from "./map";
import { CategoryData, SubmitMsg } from "@/interfaces/data";
import { LuX } from "react-icons/lu";
import { APIResponseData } from "@/interfaces/responses";


interface CategorEditorProps{
    categoryId: string // id for the category being edited: empty string means new category
    showEditor: boolean
    setShowEditor: Dispatch<SetStateAction<boolean>>
}

const blankCategory: CategoryData = { _id: "", name: "", color: "#7f7f7f" };

export function CategoryEditor({ categoryId, showEditor, setShowEditor }: CategorEditorProps) {    
    // get context
    const { categories, setCategories } = useContext(MapStatesContext);
    const [currCategory, setCurrCategory] = useState<CategoryData>(blankCategory);
    const [submitMsg, setSubmitMsg] = useState<SubmitMsg>({ message: "", ok: "bad" });

    // get category on mount
    useEffect(() => {
        const foundCategory = categories.get(categoryId);
        setCurrCategory(curr => (foundCategory ?? curr));
    }, []);

    // handle name change
    const handleNameChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setCurrCategory({...currCategory, name: e.target.value});
        setSubmitMsg({ message: "", ok: "bad" });

    };

    // save category function
    const handleSave = async () => {
        const payload = {
                    name: currCategory.name,
                    color: currCategory.color
                };
        // console.log(payload);

        const methodType = currCategory._id ? "PUT" : "POST";

        try {
            const res = await fetch(`/api/categories/${currCategory._id}`, {
                method: methodType,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const resData: APIResponseData<CategoryData> = await res.json();

            if (resData.status === "error") {
                if (res.status == 409) {
                    setSubmitMsg({ message: resData.message, ok: "bad" });
                } else {
                    setSubmitMsg({ message: "Error submitting. Please try again.", ok: "bad" });
                }
                return;
            }

            // setting updated note data to currData
            const updatedData = resData.resData;
            setCurrCategory(prev => updatedData);

            // updating notes list
            setCategories(prevMap =>
                new Map(
                    [...prevMap.entries()].filter(
                        (entry) => entry[0] !== updatedData._id
                    ).concat([[updatedData._id, updatedData]])
                )
            );

            setSubmitMsg({ message: "Success!", ok: "good" });

        } catch (error) {
            setSubmitMsg({ message: "Error submitting. Please try again.", ok: "bad" });
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-40 max-w-40 h-fit p-1 gap-1 rounded-sm bg-field border-2 border-solid border-foreground"
            onClick={(e) => e.stopPropagation()}>
            
            {/* title and X button */}
            <div className="flex flex-row w-full align-top gap-1 mb-1">
                <h6 className="flex flex-col grow h-auto font-semibold text-neutral-900">
                    {currCategory._id ? "Edit category" : "Add Category"}
                </h6>
                <button onClick={() => setShowEditor(false)}
                    className="cate-edit-x-size grow-0 p-1 rounded-full hover:bg-foreground/20 text-foreground">
                    <LuX className="w-full h-full"/>
                </button>
            </div>
            
            {/* category name text area */}
            <div className="flex flex-row w-full max-w-full gap-1 items-center">
                <textarea className="w-full max-w-full resize-none h-fit border-b border-solid text-neutral-900" 
                            id="name-ce" maxLength={30} placeholder="Name" defaultValue={currCategory.name} 
                            onChange={handleNameChange}/>
                <p className="text-foreground text-sm">{`${currCategory.name.length}/30`}</p>
            </div>
            
            {/* color picker */}
            <div className="flex flex-row w-full justify-between">
                <label htmlFor="selectColor" className="text-neutral-900 font-semibold">Color:</label>
                <input type="color" id="selectColor" defaultValue={currCategory.color} 
                    onChange={(e) => setCurrCategory({...currCategory, color: e.target.value})}/>
            </div>

            {/* error message */}
            {submitMsg && <p className={`${(submitMsg.ok === "good") ? "text-[#2dad53]" : "text-[#a22a24]"} text-xs`}>{submitMsg.message}</p>}
            
            {/* save button */}
            <button onClick={handleSave} className="fit-pill-button bg-primary hover:bg-secondary font-semibold contrast-text">
                Save
            </button>
            
        </div>
    );
}