import { Router } from "express"
import { z } from "zod"
import sql from "../../db/db.js"
import SpotifyRouter from './spotify.js'
import { getAuthUser } from '../../auth.js'
import { userServicesTypeSchema } from "../../db/schemas/user.js"

const router = Router()

router.use('/spotify', SpotifyRouter)

// For each service type, check if status of user's connection to the service
// The result is { connected: bool }
router.get('/:type/status/', async (req, res, next) => {
    try {
        const user_id = getAuthUser(req).id
        const { type } = z.object({ 
            type: userServicesTypeSchema
        }).parse(req.params)

        const result = await sql`
            SELECT
                1
            FROM
                user_services us
            WHERE
                us.user_id = ${user_id}
                AND service_type = ${type}`
        res.status(200).json({ connected: result.count > 0 })
    } catch (e) {
        return next(e)
    }
})


export default router