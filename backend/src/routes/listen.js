import { Router } from "express"
import { z } from "zod"
import { authGate, getAuthUser } from "../auth.js"
import { insertListen, insertListenById } from "../db/listen.js"
import { albumSchemaT, artistSchema, songSchema } from "../schemas/metadata.js"
import { coerceStrSchemaT, timestampSchemaT, idSchema } from "../schemas/shared.js"

const router = Router()

// Returns listen_id, song_id, time_stamp
router.post('/log-by-id', authGate(), async (req, res, next) => {
    const inputSchemaT = z.object({
        song_id: idSchema,
        time_stamp: timestampSchemaT
    })
    try {
        const { song_id, time_stamp } = inputSchemaT.parse(req.body)
        const user_id = getAuthUser(req).id

        const result = await insertListenById({ user_id, song_id, time_stamp })
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

// Required: song name and artists (array of string artist names or artist objects with 'name' field) with length at least 1
// Returns listen_id, song_id, time_stamp, artists (id, name, image per artist), album (id, name, image, and artists)
router.post('/log', authGate(), async (req, res, next) => {
    const artistArraySchemaT = z.union([
        z.string().array().nonempty().transform(arr => arr.map(e => { return { name: e } })),
        artistSchema.array().nonempty()
    ])
    const inputSchemaT = z.object({
        song_name: coerceStrSchemaT,
        artists: artistArraySchemaT,
        // optional
        song_metadata: songSchema.omit({ name: true }).nullish(),
        album: albumSchemaT.nullish(),
        album_artists: artistArraySchemaT.nullish(),
        time_stamp: timestampSchemaT.nullish()
    })

    try {
        const user_id = getAuthUser(req).id
        const { 
            song_name, 
            artists,
            // optional fields
            song_metadata,
            album,
            album_artists,
            time_stamp
        } = inputSchemaT.parse(req.body)

        const result = await insertListen({
            user_id: user_id,
            time_stamp: time_stamp,
            song: { ...song_metadata, name: song_name },
            songArtists: artists,
            album: album,
            albumArtists: album_artists
        })
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

export default router