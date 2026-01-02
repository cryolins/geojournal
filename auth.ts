import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./lib/db";
import { User } from "./models/User";
import { InvalidCredentialsError, MissingCredentialsError } from "./lib/errors";

interface ExpectedCredentials {
  userOrEmail: string;
  password: string;
}

export const authOptions: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                userOrEmail: { type: "text" },
                password: { type: "password" }
            },
            async authorize(credentials) {   
                // if credentials or its fields are missing, decline authorizing   
                const { userOrEmail, password } = credentials as ExpectedCredentials;
                if (!credentials || !userOrEmail || !password) {
                    throw new MissingCredentialsError();
                }

                // connect to database
                await connectDB();  

                // checks if input was username or email based on containing a @ symbol
                const searchByEmail = userOrEmail.includes("@");
                const searchParams = searchByEmail ? { email: userOrEmail } : { username: userOrEmail };
                const user = await User.findOne(searchParams);

                // no user found: raise error
                if (!user) {
                    throw new InvalidCredentialsError();
                }

                // check password: if wrong raise error
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    throw new InvalidCredentialsError();
                }

                // return user as everything is valid
                return {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    name: user.name,
                };
            }
        })
    ],
    
    callbacks: {
            async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user){
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.username = token.username;
            }
            return session;
        }
    },

    pages: {
        signIn: "/login"
    }
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);