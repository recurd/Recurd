import { z } from "zod"
import { coerceStrSchemaT, urlSchema, timestampSchemaT } from "./shared.js"

export const artistSchema = z.object({ 
    name: coerceStrSchemaT,
    image: urlSchema.nullish(),
    description: z.string().nullish()
})

export const albumTypeSchema = z.enum(['album', 'single'])
export const albumSchemaT = z.object({ 
    name: coerceStrSchemaT,
    image: urlSchema.nullish(),
    album_type: albumTypeSchema.nullish(), // has DB default
    release_date: timestampSchemaT.nullish()
})

export const songSchema = z.object({
    name: coerceStrSchemaT,
    image: urlSchema.nullish()
})

// NOTE: Contains only the unique info that a track has
// For a complete track object, use songSchema.merge(trackSchema)
export const trackSchema = z.object({
    disc_number: z.number().int().min(1).default(1),
    album_position: z.number().int().min(1).nullish()
})