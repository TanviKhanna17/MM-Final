import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import {dbConnect} from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [ // database me kisi ke basis pe pe bhi dhoondho
                            { email: credentials.identifier },
                            { isername: credentials.identifier },
                        ],
                    })
                    if (!user) {
                        throw new Error("No user founf with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account first")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    }
                    else {
                        throw new Error("Incorrect Password")
                    }
                }
                catch (error: any) {
                    throw new Error(error)
                }
            },
        }),
    ],
    callbacks: { //Callbacks are asynchronous functions you can use to control what happens when an action is performed.
        async jwt({ token, user }) { // token ke andar user ka id hoti hai sirf
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token              // strategise in such a way so as to access all infor from token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: { // define which strategy to use
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
};