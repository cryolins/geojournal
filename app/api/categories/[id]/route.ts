import { optionalCategoryRequestSchema } from "@/interfaces/requests";
import { verifyUser } from "@/lib/api-helpers";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const verifyResult = await verifyUser(params, Category, "category");
        if (verifyResult instanceof NextResponse) {
            return verifyResult;
        }

        // otherwise, verifyResult is the id
        await connectDB();
        const foundCategory = await Category.findById(verifyResult).lean(); // find it again
        return NextResponse.json(foundCategory, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `Error getting category: ${error}` }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const verifyResult = await verifyUser(params, Category, "category");
        if (verifyResult instanceof NextResponse) {
            return verifyResult;
        }

        // get and validate request data
        const reqData = await req.json();
        const zodResult = optionalCategoryRequestSchema.safeParse(reqData);
        if (!zodResult.success) {
            return NextResponse.json(
                { message: `Invalid body. Error: ${zodResult.error.message}` }, { status: 400 }
            );
        }
        const categoryData = zodResult.data;

        try {
            const updatedCategory = await Category.findByIdAndUpdate(verifyResult, categoryData, 
                { new: true, runValidators: true, lean: true });
            if (!updatedCategory) {
                return NextResponse.json({ message: "Category not found" }, { status: 404 });
            }
            return NextResponse.json(updatedCategory, { status: 200 });
        } catch (error) {
            return NextResponse.json({ message: "Invalid update" }, { status: 400 });
        }   
        
    } catch (error) {
        return NextResponse.json({ message: `Error updating category: ${error}` }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const verifyResult = await verifyUser(params, Category, "category");
        if (verifyResult instanceof NextResponse) {
            return verifyResult;
        }
        
        try {
            const deletedCategory = await Category.findByIdAndDelete(verifyResult, { lean: true });
            if (!deletedCategory) {
                return NextResponse.json({ message: "Category not found" }, { status: 404 });
            }
            return NextResponse.json({ message: "Successfully deleted category" }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ message: "Invalid delete" }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ message: `Error deleting category: ${error}` }, { status: 500 });
    }
}