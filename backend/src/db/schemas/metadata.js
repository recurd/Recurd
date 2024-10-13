import { z } from "zod"
import { timestampSchemaT } from "./shared.js"

export const listenSchemaT = z.object({
    user_id: z.string().uuid(),
    song_id: z.string().uuid(),
    time_stamp: timestampSchemaT.nullish()
})

export const artistSchema = z.object({ 
    name: z.coerce.string(),
    image: z.string().nullish(),
    description: z.string().nullish()
})

export const albumSchemaT = z.object({ 
    name: z.coerce.string(),
    image: z.string().nullish(),
    album_type: z.enum(['album', 'single']).nullish(), // has DB default
    release_date: timestampSchemaT.nullish()
})

export const songSchema = z.object({
    name: z.string(),
    image: z.string().nullish()
})