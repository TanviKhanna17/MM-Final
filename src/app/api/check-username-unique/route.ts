import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

// creating a query schema

const UsernameQuerySchema = z.object({
    username: usernameValidation // is object ke andar jo username ayega it should fulfill validation  
})

// writing a get method ki username valid hai ke nahi

export async function GET(request: Request)
{
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = { // this is an object no direct usernames
            username : searchParams.get('username')  // requested url me se username extraction
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result) // can remove
        if (!result.success)
        {
            const usernameErrors = result.error.format()
                .username?._errors || []                 // filter out only username related errors otherwise retur empty array
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(',') : 'Invalid Query Parameters',
            },{status:400})
        }

        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser)
            {
                return Response.json({
                    success: false,
                    message: 'Username is already Taken'
                },{status:400})
        }
        
        return Response.json({
            success: true,
            message: 'Username is unique'
        },{status:400})
        
    }
    catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status: 500}
        )
    }
}