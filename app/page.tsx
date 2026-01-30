import Image from "next/image";
import { inter } from "./layout";
import { auth } from "@/auth-edge";
import HomeMapComponent from "@/components/map/home-map/home-map";
import HomeMapClientWrapper from "@/components/map/home-map/home-map-client-wrapper";

export default async function Home() {  
    return (
        <div className="flex flex-col gap-2 h-screen max-h-screen relative">
            <HomeMapClientWrapper/>
        </div>
    )
}
