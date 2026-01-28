import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


// getting secret
const SECRET = process.env.NEXTAUTH_SECRET!;

if (!SECRET) {
    throw new Error("no next-auth secret found")
}

export default async function authMiddleware (req: NextRequest) {
    // path protection configuration
    const authPaths = ["/login", "/signup"];
    const protPaths = ["/map", "/settings"];

    const token = await getToken({ req, secret: SECRET });
    const nextPath = req.nextUrl.pathname;
    const originalUrl = req.nextUrl.protocol + req.headers.get("host") + req.nextUrl.pathname;
    //console.log(token);

    if (!token && protPaths.includes(nextPath)) {
        // trying to access protected paths without logging in -> redirect to login page
        return NextResponse.redirect(new URL("/login", originalUrl));
    } else if (token && authPaths.includes(nextPath)) {
        // trying to access login paths while being logged in -> redirect to map page
        return NextResponse.redirect(new URL("/map", originalUrl));
    }
    // can add rbac or other conditions as needed
    else{
        return NextResponse.next();
    }
}