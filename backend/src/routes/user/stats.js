
import { Router } from "express"
import { z } from "zod"
import Database from "../../db.js"
import { idSchema } from "../../schemas/shared.js"

const router = Router({mergeParams: true})

// Returns the hour, song id, song name, and number of listens within the hour for a day
router.get('/songs-by-hour', async (req, res, next) => {
    try {
        // Validate the user_id parameter
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

export default router