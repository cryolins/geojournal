import { optionalCategoryRequestSchema } from "@/interfaces/requests";
import { verifyUser } from "@/lib/api-helpers";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Note } from "@/models/Note";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const verifyResult = await verifyUser(params, Category, "category");
        if (verifyResult instanceof NextResponse) {
            return verifyResult;
        }

        const { id } = verifyResult;

        // use id
        await connectDB();
        const foundCategory = await Category.findById(id).lean(); // find it again
        return NextResponse.json({ status: "success", resData: foundCategory }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error getting category: ${error}` }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const verifyResult = await verifyUser(params, Category, "category");
        if (verifyResult instanceof NextResponse) {
            return verifyResult;
        }

        const { id, userId } = verifyResult;

        // get and validate request data
        const reqData = await req.json();
        const zodResult = optionalCategoryRequestSchema.safeParse(reqData);
        if (!zodResult.success) {
            return NextResponse.json(
                { status: "error", message: `Invalid body. Error: ${zodResult.error.message}` }, { status: 400 }
            );
        }
        const categoryData = zodResult.data;

        try {
            // checking if duplicate user/name combo exists
            const foundCategory = await Category.findOne({ userId, name: categoryData.name, _id: { $ne: id } }).lean();
            if(foundCategory) {
                return NextResponse.json(
                    { status: "error", message: "Error: duplicate name" },
                    { status: 409 }
                );
            }
            
            // updating otherwise
            const updatedCategory = await Category.findByIdAndUpdate(id, categoryData, 
                { new: true, runValidators: true, lean: true });
            if (!updatedCategory) {
                return NextResponse.json({ status: "error", message: "Category not found" }, { status: 404 });
            }
            return NextResponse.json({ status: "success", resData: updatedCategory }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ status: "error", message: "Invalid update" }, { status: 400 });
        }   
        
    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error updating category: ${error}` }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const verifyResult = await verifyUser(params, Category, "category");
        if (verifyResult instanceof NextResponse) {
            return verifyResult;
        }

        const { id, userId } = verifyResult;

        // remove category from all notes that contain it
        await Note.updateMany({ userId, categoryIds: id }, { $pull: { categoryIds: id }});
        
        try {
            const deletedCategory = await Category.findByIdAndDelete(id, { lean: true });
            if (!deletedCategory) {
                return NextResponse.json({ status: "error", message: "Category not found" }, { status: 404 });
            }
            return NextResponse.json({ status: "success", resData: "Successfully deleted category" }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ status: "error", message: "Invalid delete" }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error deleting category: ${error}` }, { status: 500 });
    }
}