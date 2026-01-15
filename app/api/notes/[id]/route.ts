import { optionalNoteRequestSchema } from "@/interfaces/requests";
import { verifyUser } from "@/lib/api-helpers";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const verifyResult = await verifyUser(params, Note, "note");
        if (verifyResult instanceof NextResponse) {
            return verifyResult;
        }

        // otherwise, verifyResult is the id
        await connectDB();
        const foundNote = await Note.findById(verifyResult).lean(); // find it again
        return NextResponse.json({ status: "success", resData: foundNote }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error getting note: ${error}` }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const verifyResult = await verifyUser(params, Note, "note");
        if (verifyResult instanceof NextResponse) {
            return verifyResult;
        }

        // get and validate request data
        const reqData = await req.json();
        const zodResult = optionalNoteRequestSchema.safeParse(reqData);
        if (!zodResult.success) {
            return NextResponse.json(
                { status: "error", message: `Invalid body. Error: ${zodResult.error.message}` }, { status: 400 }
            );
        }

        // parsing data into update query
        const { title, body, imageLinks, categoryIds, lng, lat } = zodResult.data;
        const location = (lng && lat) ? { type: "Point", coordinates: [lng, lat] } : undefined;
        const noteData = { title, body, imageLinks, categoryIds, location }

        try {
            const updatedNote = await Note.findByIdAndUpdate(verifyResult, noteData, 
                { new: true, runValidators: true, lean: true });
            if (!updatedNote) {
                return NextResponse.json({ status: "error", message: "Note not found" }, { status: 404 });
            }
            return NextResponse.json({ status: "success", resData: updatedNote }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ status: "error", message: "Invalid update" }, { status: 400 });
        }
        
        
    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error updating note: ${error}` }, { status: 500 });
    }
    
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const verifyResult = await verifyUser(params, Note, "note");
        if (verifyResult instanceof NextResponse) {
            return verifyResult;
        }
        
        try {
            const deletedNote = await Note.findByIdAndDelete(verifyResult, { lean: true });
            if (!deletedNote) {
                return NextResponse.json({ status: "error", message: "Note not found" }, { status: 404 });
            }
            return NextResponse.json({ status: "success", resData: "Successfully deleted note" }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ status: "error", message: "Invalid delete" }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error deleting note: ${error}` }, { status: 500 });
    }
}