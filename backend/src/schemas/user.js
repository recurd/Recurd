import { z } from "zod"
import { coerceStrSchemaT, urlSchema, nonEmptyStrSchema, timestampSchemaT, idSchema } from "./shared.js"

export const userSchemaT = z.object({
    username: nonEmptyStrSchema.regex(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
    password: coerceStrSchemaT,
    display_name: nonEmptyStrSchema,
    image: urlSchema.nullish()
})

export const userServicesTypeSchema = z.enum(['spotify'])
export const userServices = z.object({
    user_id: idSchema, 
    service_type: userServicesTypeSchema.nullish(),
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