import { z } from 'zod'

export const signInSchema = z.object({ // jab sign in hoga we need an identifier for example email/username
    identifier: z.string(),
    password: z.string(),
})