
import { Router } from "express"
import { z } from "zod"
import Database from "../../db.js"
import { idSchema } from "../../schemas/shared.js"

const router = Router({mergeParams: true})

// Returns the hour, song id, song name, and number of listens within the hour for a day
router.get('/songs-by-hour', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)

        // Validate the query parameters: expecting 'date' in YYYY-MM-DD format
        const querySchema = z.object({
            date: z.string().date()
        })

        const { date } = querySchema.parse(req.query)

        const songsByHour = await Database.User.getSongsByHour({
            userId: user_id,
            date: date
        })

        res.status(200).json(songsByHour)
    } catch (e) {
        next(e)
    }
})

// Returns the average rating and number of ratings for a user's song opinions
router.get('/song-rating-stats', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)

        const songRatingStats = await Database.User.getUserSongRatingStats(user_id)

        res.status(200).json(songRatingStats)
    } catch (e) {
        next(e)
    }
})

// Returns the average rating and number of ratings for a user's album opinions
router.get('/album-rating-stats', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)

        const albumRatingStats = await Database.User.getUserAlbumRatingStats(user_id)

        res.status(200).json(albumRatingStats)
    } catch (e) {
        next(e)
    }
})

export default router