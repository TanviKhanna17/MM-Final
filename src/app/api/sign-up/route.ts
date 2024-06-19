import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import {dbConnect} from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json() // email password wagera json data se le liya
        const existingUserVerifiedByUsername = await UserModel.findOne({ // aisa banda dhoondho jiska username bhi ho aur verfied bhi
            username,
            isVerified:true
        })
        if (existingUserVerifiedByUsername)
        {
            return Response.json({
                success: false,
                message:"Username already taken"
            },
            {
                status:400
            })
        }

        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message:"User already exist with this email"
                },{status: 400})
            }     
            else {
                const hashedPassword = await bcrypt.hash
                    (password, 10) // 10 rounds of hash
                existingUserByEmail.password = hashedPassword; //overwriting our password , mtlb maybe user ko password yaad na ho
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save() // ab user ko save kara do
            }
        }
        else { // user aaya hi pehli baar hain
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date() // yeh object deta hain "new" memory ke andar reference point hain uske andar values change hoti hain
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({ // naya user bana do
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages:[]               
            })
            
            await newUser.save()  // iss naye user ko save kardo

        }
        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) { // agar this email response does not return success then return this json response
            return Response.json({
                success: false,
                message:emailResponse.message
            },{status: 500})
        }
        return Response.json({
            success: true,
            message:"user registered Successfully. Please verify your email." // user register hogaya abh
        },{status: 500})
    }
    catch (error)
    {
        console.log("Error registering user", error) // response sent on frontend
        return Response.json(
            {
                success: false,
                message:"Error registering user",
            },
            {
                status:500
            }
        )
    }
    
}
