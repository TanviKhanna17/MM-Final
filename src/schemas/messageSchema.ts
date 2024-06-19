import { z } from 'zod'

export const MessageSchema = z.object({ // jab sign in hoga we need an identifier for example email/username
    content: z 
        .string()
        .min(10,{message: 'Content must be of at least 10 min characters' })
        .max(300, { message: 'Content must be no longer than 300 characters' })
})