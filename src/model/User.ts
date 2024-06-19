import mongoose, { Schema, Document } from "mongoose"; // defining more variablems mongoose schema and dcoument to introduce type safety

// defining type of data

export interface Message extends Document{ //gives a structure 
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({ // uses custom defined data structure defined above
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
    
})

// USER KA Schema----

export interface User extends Document{ //gives a structure 
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[] // har message ka apna khud ka document hoga so user ke saare messages as an array feed kar denge
}

const UserSchema: Schema<User> = new Schema({ // uses custom defined data structure defined above
    username: {
        type: String,
        required: [true, "Username is required"], // if not true pass this string
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use valid email address'] // checking for basic email validation RegEx
    },
    password: {
        type: String,
        required:[true,"Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true,"Verify Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true,"Verify Code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages:[MessageSchema]
    
    // in next js run on edge, doesn't know if app is being run for the first time or previous times
    // check karenge ki agar user model bana huya ho toh de do otherwise bana ke dedo

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema)) // expected object being created is being returned of type User otherwise tum bana do

export default UserModel;



