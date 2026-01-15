import { LogoutButton } from "@/components/auth/auth-buttons";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { APIButton } from "@/components/test-buttons";
import MapClientWrapper from "@/components/map/map-client-wrapper";

export default async function MapPage() {
    const session = await auth();
    
    if (!session) {
        // fallback case when signed out from another tab
        redirect("/login");
    }
    
    return (
        <div className="flex flex-col gap-2 h-screen max-h-screen relative">
            <MapClientWrapper />
        </div>
    )
}