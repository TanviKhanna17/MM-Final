// these files are not used to define schema but rather for validating
// zod has been downloaded to perform tasks for all validations in schemas

import { z } from 'zod'

export const usernameValidation = z // no need for object because only one value
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")
    
export const signUpSchema = z.object({

    username: usernameValidation,
    email: z.string().email({ message: "Invalid Email address" }),
    password: z.string().min(6,{message:"Password should be min 6 characters"})
})