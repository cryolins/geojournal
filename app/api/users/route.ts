import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { editUserRequestSchema, signupRequestSchema } from "@/interfaces/requests";
import { Note } from "@/models/Note";
import { Category } from "@/models/Category";

export async function GET(req: NextRequest) {
    try {
        // auth check
        const session = await auth();
        if (!session) {
            return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
        }

        const foundUser = await User.findById(session.user.id).lean();
        if (!foundUser) {
            // no such user, maybe as a result of getting deleted: redirect to login
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.json({ status: "success", resData: foundUser }, { status: 200})

    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error getting user: ${error}` }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // getting and validating data
        const reqData = await req.json();
        const zodResult = signupRequestSchema.safeParse(reqData);
        if (!zodResult.success) {
            return NextResponse.json(
                { status: "error", message: `Invalid body. Error: ${zodResult.error.message}` }, { status: 400 }
            );
        }
        const signupInput = zodResult.data;

        // connect to db
        await connectDB();

        // checking for existing email
        const existingEmailUser = await User.findOne({ email: signupInput.email });
        if(existingEmailUser) {
            return NextResponse.json(
                { status: "error", message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // checking for existing username
        const existingNameUser = await User.findOne({ username: signupInput.username });
        if(existingNameUser) {
            return NextResponse.json(
                { status: "error", message: "This username is already taken" },
                { status: 409 }
            );
        }

        // no duplicates, so we can add user
        const hashedPassword = await bcrypt.hash(signupInput.password, 10);
        await User.create({
            username: signupInput.username,
            password: hashedPassword,
            email: signupInput.email,
            name: signupInput.username
        });

        const createdUser = await User.findOne({ username: signupInput.username });
        return NextResponse.json(
            { status: "success", resData: createdUser },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error creating user: ${error}` }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        // auth check
        const session = await auth();
        if (!session) {
            return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
        }

        // getting and validating data
        const reqData = await req.json();
        const zodResult = editUserRequestSchema.safeParse(reqData);
        if (!zodResult.success) {
            return NextResponse.json(
                { status: "error", message: `Invalid body. Error: ${zodResult.error.message}` }, { status: 400 }
            );
        }
        const updateInput = zodResult.data;

        // connect to db
        await connectDB();
        const user: any = await User.findById(session.user.id).lean();
        if (!user) {
            // no such user, maybe as a result of getting deleted: redirect to login
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // compare password
        const isValidPassword = await bcrypt.compare(updateInput.oldPassword, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ status: "error", message: "Invalid password" }, { status: 401 });
        }
        
        const hashedNewPassword = updateInput.newPassword ? await bcrypt.hash(updateInput.newPassword, 10) : undefined;

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id, 
            { 
                email: updateInput.email, 
                username: updateInput.username,
                name: updateInput.name,
                password: hashedNewPassword
            },
            { new: true, runValidators: true, lean: true }
        ).lean();
        return NextResponse.json({ status: "success", resData: updatedUser }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error updating user: ${error}` }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        // auth check
        const session = await auth();
        if (!session) {
            return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
        }

        await User.findByIdAndDelete(session.user.id, { lean: true });
        await Note.deleteMany({ userId: session.user.id });
        await Category.deleteMany({ userId: session.user.id });

        return NextResponse.json(
            { status: "success", resData: `Successfully deleted user ${session.user.id} and their notes and categories`},
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json({ status: "error", message: `Error deleting user: ${error}` }, { status: 500 });
    }
}
