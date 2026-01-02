import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { SignupInput } from "@/interfaces/signin";


export async function POST(request: Request) {
    try {
        //awaiting data and connection
        const signupInput: SignupInput = await request.json();
        await connectDB();

        // checking for existing email
        const existingEmailUser = await User.findOne({ email: signupInput.email });
        if(existingEmailUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // checking for existing username
        const existingNameUser = await User.findOne({ username: signupInput.username });
        if(existingNameUser) {
            return NextResponse.json(
                { message: "This username is already taken" },
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
            createdUser,
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: `Error creating user: ${error}` },
            { status: 500 }
        );
    }

}