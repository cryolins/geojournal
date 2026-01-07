import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Model } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function verifyUser(params: Promise<{ id: string }>, Schema: Model<any>, name: string = "entry") {
    try {
        // auth check
        const session = await auth();
        if(!session){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const id = (await params).id;
        
        // connect to db
        await connectDB();
        const foundEntry = await Schema.findById(id).lean();

        if (!foundEntry) {
            return NextResponse.json({ message: `${name} not found` }, { status: 404 });
        }

        // verify user id
        if (session.user.id != foundEntry.userId) {
            return NextResponse.json(
                { message: `User does not have access to this ${name}` },
                { status: 403 }
            );
        }
        return id;
    } catch (error) {
        return NextResponse.json({ message: `Error getting ${name}: ${error}` }, { status: 500 });
    }
}