import { Router } from "express"
import { z } from "zod"
import Database from "../../db.js"
import { idSchema, timestampPaginationSchema } from "../../schemas/shared.js"

const router = Router({mergeParams: true})

// Get top (n) artist (id, name, ...), listen count (per artist)
router.get('/artists', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const { start_date, end_date, n } = timestampPaginationSchema.parse(req.query)

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
        const { start_date, end_date, n } = timestampPaginationSchema.parse(req.query)

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
        const { start_date, end_date, n } = timestampPaginationSchema.parse(req.query)

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