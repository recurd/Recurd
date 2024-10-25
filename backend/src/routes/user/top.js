import { Router } from "express"
import { z } from "zod"
import Database from "../../db.js"
import { timestampSchemaT, idSchema } from "../../schemas/shared.js"

const router = Router({mergeParams: true})

const topSchemaT = z.object({
    start_date: timestampSchemaT,
    end_date: timestampSchemaT.nullish().transform(d => d ? d : new Date()), // defaults to current time
    n: z.number().int().gt(0).lte(100).nullish().default(10)
}).refine(obj =>
    obj.start_date < obj.end_date, {
        message: "start_date must be before end_date"
    })

// Get top (n) artist (id, name, ...), listen count (per artist)
router.get('/artists', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const { start_date, end_date, n } = topSchemaT.parse(req.body)

        const topArtists = await Database.User.getTopArtists({
            user_id: user_id,
            start_date: start_date,
            end_date: end_date,
            n: n
        })
        return res.status(200).json(topArtists)
    } catch (e) {
        return next(e)
    }
})

// Get top (n) album (id, name, image), listen count (per album)
router.get('/albums', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const { start_date, end_date, n } = topSchemaT.parse(req.body)

        const topAlbums = await Database.User.getTopAlbums({
            user_id: user_id,
            start_date: start_date,
            end_date: end_date,
            n: n
        })
        res.json(topAlbums)
    } catch (e) {
        return next(e)
    }
})


// Get top (n) song (id and name), album_image, artists (array of json)
router.get('/songs', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const { start_date, end_date, n } = topSchemaT.parse(req.body)

        const topSongs = await Database.User.getTopSongs({
            user_id: user_id,
            start_date: start_date,
            end_date: end_date,
            n: n
        })
        res.json(topSongs)
    } catch (e) {
        return next(e)
    }
})

export default router