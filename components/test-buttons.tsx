"use client";

export function APIButton () {
    const sendClick = async () => {
        try {
            const payload = {
                /*title: "note b2",
                body: "woweeeeeeeeee",
                imageLinks: [],
                categoryIds: ["69633bd9aa0233f6b7aa50e9"],
                lng: 43.5,
                lat: -80.5*/

                name: "1e",
                color: "#1e1e1E"
            };
            const res = await fetch("/api/visualize", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const resData = await res.json();
            if (!res.ok) {
                console.error(resData.message);
            } else {
                console.log(resData);
            }
            
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <button className="flex items-center justify-center p-1 px-4 bg-primary rounded-full w-fit hover:bg-secondary transition-colors">
            <h6 className="contrast-text" onClick={sendClick}>Send{/*isSubmitting ? "..." : ""*/}</h6>
        </button>
    );
}