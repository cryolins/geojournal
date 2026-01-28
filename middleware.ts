import { NextResponse } from "next/server";
import { auth } from "./auth-edge";


// getting secret
const SECRET = process.env.NEXTAUTH_SECRET!;

if (!SECRET) {
    throw new Error("no next-auth secret found")
}

export default auth((req) => {
    // path protection configuration
    const authPaths = ["/login", "/signup"];
    const protPaths = ["/map", "/settings"];

    const session = req.auth;
    const nextPath = req.nextUrl.pathname;
    
    if (!session && protPaths.includes(nextPath)) {
        // trying to access protected paths without logging in -> redirect to login page
        return NextResponse.redirect(new URL("/login", req.url));
    } else if (!!session && authPaths.includes(nextPath)) {
        // trying to access login paths while being logged in -> redirect to map page
        return NextResponse.redirect(new URL("/map", req.url));
    }
    // can add rbac or other conditions as needed
    else{
        return NextResponse.next();
    }
})