import { z } from "zod"
import { coerceStrSchemaT, urlSchema, nonEmptyStrSchema, timestampSchemaT, idSchema } from "./shared.js"

export const userSchemaT = z.object({
    username: nonEmptyStrSchema,
    password: coerceStrSchemaT,
    display_name: nonEmptyStrSchema,
    image: urlSchema.nullish()
})

export const userServices = z.object({
    user_id: idSchema, 
    service_type: z.enum(['spotify']).nullish(),
    access_token: nonEmptyStrSchema,
    refresh_token: nonEmptyStrSchema,
    expires_at: timestampSchemaT.nullish(),
    last_updated: timestampSchemaT.nullish()
})

export const userFollowers = z.object({
    followee: idSchema,
    folower: idSchema,
    time_stamp: timestampSchemaT.nullish()
})