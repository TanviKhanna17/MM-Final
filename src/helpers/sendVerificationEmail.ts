import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string, 
): Promise<ApiResponse>{ // return type => promise
    
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message | Verification Code',
            react: VerificationEmail({username,otp:verifyCode}), // kounsa react part bhejna hain, which component to send
          });
        return {success:true,message:'Verification email sent successfully'}
    }
    catch (emailError){
        console.log("Error Sending verification email", emailError)
        return {success:false,message:'Failed to send verification email'}
    }
}