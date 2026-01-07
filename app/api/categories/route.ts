import { auth } from "@/auth";
import { categoryRequestSchema } from "@/interfaces/requests";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
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

        // connect to db
        await connectDB();
        const foundNotes = await Category.find(dbQuery).lean();
        
        return NextResponse.json(foundNotes, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: `Error getting categories: ${error}` }, { status: 500 });
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
        const zodResult = categoryRequestSchema.safeParse(reqData);
        if (!zodResult.success) {
            return NextResponse.json(
                { message: `Invalid body. Error: ${zodResult.error.message}` }, { status: 400 }
            );
        }
        const categoryData = zodResult.data;

        // connect to db
        await connectDB();

        const category = await Category.create({
            userId: session.user.id,
            name: categoryData.name,
            color: categoryData.color
        });

        return NextResponse.json(category, { status: 201 });
        
    } catch (error) {
        return NextResponse.json({ message: `Error creating category: ${error}` }, { status: 500 });
    }
}