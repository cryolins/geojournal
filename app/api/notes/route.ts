import { auth } from "@/auth";
import { noteRequestSchema } from "@/interfaces/requests";
import { connectDB } from "@/lib/db";
import { Note } from "@/models/Note";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        // auth check
        const session = await auth();
        if(!session){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // building db query
        const dbQuery: any = {
            userId: session.user.id,
        };

        // search/query params
        const searchParams = req.nextUrl.searchParams;

        // TODO/future update?: search by categories only, and not by location, for search bar
        // yes geo filter
        if (searchParams.has("swLat") || searchParams.has("swLng") || 
            searchParams.has("neLat") || searchParams.has("neLng")) {
            const swLat = parseFloat(searchParams.get("swLat")!);
            const swLng = parseFloat(searchParams.get("swLng")!);
            const neLat = parseFloat(searchParams.get("neLat")!);
            const neLng = parseFloat(searchParams.get("neLng")!);
            if ([swLat, swLng, neLat, neLng].some(isNaN)) {
                return NextResponse.json({ message: "Invalid map bounds" }, { status: 400 });
            }

            dbQuery.location = {
                    $geoWithin: {
                        $box: [
                            [swLng, swLat],
                            [neLng, neLat],
                        ],
                    },
                };
        }

        const categoryId = searchParams.get("categoryId");

        if (categoryId != null) {
            dbQuery.categoryIds = categoryId;
        }

        // connect to db
        await connectDB();
        const foundNotes = await Note.find(dbQuery).lean();
        
        return NextResponse.json(foundNotes, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ message: `Error getting notes: ${error}` }, { status: 500 });
    }
    
}

export async function POST(req: NextRequest) {
    try {
        // auth check
        const session = await auth();
        if(!session){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // get and validate request data
        const reqData = await req.json();
        const zodResult = noteRequestSchema.safeParse(reqData);
        if (!zodResult.success) {
            return NextResponse.json(
                { message: `Invalid body. Error: ${zodResult.error.message}` }, { status: 400 }
            );
        }
        const noteData = zodResult.data;

        // connect to db
        await connectDB();

        const note = await Note.create({
            userId: session.user.id,
            title: noteData.title,
            body: noteData.body,
            categoryIds: noteData.categoryIds,
            imageLinks: noteData.imageLinks,
            location: {
                type: "Point",
                coordinates: [noteData.lng, noteData.lat],
            },
        });

        return NextResponse.json(note, { status: 201 });
        
    } catch (error) {
        return NextResponse.json({ message: `Error creating note: ${error}` }, { status: 500 });
    }
}