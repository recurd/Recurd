import { z } from "zod"
import { coerceStrSchemaT, urlSchema, timestampSchemaT } from "./shared.js"

export const artistSchema = z.object({ 
    name: coerceStrSchemaT,
    image: urlSchema.nullish(),
    description: z.string().nullish()
})

export const albumSchemaT = z.object({ 
    name: coerceStrSchemaT,
    image: urlSchema.nullish(),
    album_type: z.enum(['album', 'single']).nullish(), // has DB default
    release_date: timestampSchemaT.nullish()
})

export const songSchema = z.object({
    name: coerceStrSchemaT,
    image: urlSchema.nullish()
})