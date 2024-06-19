import { z } from 'zod'

export const AcceptMessageSchema = z.object({ // jab sign in hoga we need an identifier for example email/username
    acceptMessages: z.boolean(),
})