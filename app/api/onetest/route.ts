import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";
import { latLngToCell } from "h3-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // auth check
        const session = await auth();
        if(!session){
            return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
        }

        // connect to db
        await connectDB();
        const notes = await Note.find({});
        for (const n of notes) {
            n.h3 = {
                h3_7: latLngToCell(n.location.coordinates[1], n.location.coordinates[0], 7),
                h3_8: latLngToCell(n.location.coordinates[1], n.location.coordinates[0], 8),
                h3_9: latLngToCell(n.location.coordinates[1], n.location.coordinates[0], 9)
            }
            await n.save();
        }
        

        // return
        return NextResponse.json({ status: "success", resData: "yay" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error getting notes data: ${error}` }, { status: 500 });
    }
}