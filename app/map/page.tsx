import { LogoutButton } from "@/components/auth/auth-buttons";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function MapPage() {
    const session = await auth();
    
    if (!session) {
        // fallback case when signed out from another tab
        redirect("/login");
    }
    
    return (
        <div className="flex flex-col gap-2">
            <p>hi, {JSON.stringify(session)}</p>
            <LogoutButton/>
        </div>
    )
}