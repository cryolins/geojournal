"use client"; // TODO remove this as we add actual components
import { LogoutButton } from "@/components/auth-buttons";
import { useSession } from "next-auth/react"

export default function MapPage() {
    const { data, status } = useSession();
    
    if (status === "unauthenticated") {
        // shouldn't happen due to middleware, but here as a fallback case
        return <p>please sign in</p>
    } else if (status === "loading") {
        return <p>loading...</p>
    }
    
    return (
        <div className="flex flex-col gap-2">
            <p>hi, {JSON.stringify(data)}</p>
            <LogoutButton/>
        </div>
    )
}