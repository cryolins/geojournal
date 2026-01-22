import { auth } from "@/auth";
import { IKAuthData } from "@/interfaces/data"
import { getUploadAuthParams } from "@imagekit/next/server"
import { NextResponse } from "next/server"

// imagekit-recommended api route to fetch auth details for images
export async function GET() {
    try {
        const session = await auth();
        if(!session){
            return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
        }

        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY as string; // Never expose this on client side
        const publicKey = process.env.IMAGEKIT_PUBLIC_KEY as string;

        const { token, expire, signature } = getUploadAuthParams({ privateKey, publicKey });

        const resData: IKAuthData = { token, expire, signature, publicKey, userId: session.user.id };

        return NextResponse.json({ status: "success", resData });
    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error authenticating upload: ${error}` }, { status: 500 });
    }
}