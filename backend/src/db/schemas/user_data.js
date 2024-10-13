import { z } from "zod"
import { timestampSchemaT, idSchema, nonEmptyStrSchema } from "./shared.js"

export const listenSchemaT = z.object({
    user_id: idSchema,
    song_id: idSchema,
    time_stamp: timestampSchemaT.nullish()
})

export const albumOpinionsSchema = z.object({
    user_id: idSchema,
    album_id: idSchema, 
    time_stamp: timestampSchemaT.nullish(),
    rating: z.number().int().min(1).max(10).nullish(),
    review: nonEmptyStrSchema.nullish()
})

export const songOpinionsSchema = z.object({
    user_id: idSchema,
    song_id: idSchema, 
    time_stamp: timestampSchemaT.nullish(),
    rating: z.number().int().min(1).max(10).nullish(),
    review: nonEmptyStrSchema.nullish()
})