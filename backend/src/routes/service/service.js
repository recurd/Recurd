import { Router } from "express"
import SpotifyRouter from './spotify.js'
import { z } from "zod"
import { userServicesTypeSchema } from "../../db/schemas/user.js"

const router = Router()

router.use('/spotify', SpotifyRouter)

// For each service type, check if status of user's connection to the service
// The result is { connected: bool }
router.get('/status/:type', async (req, res, next) => {
    try {
        const user_id = getAuthUser(req).id
        const { type } = z.object({ 
            type: userServicesTypeSchema
        }).parse(req.params)

        const result = await sql`
            SELECT
                access_token
            FROM
                user_services us
            WHERE
                us.user_id = ${user_id}
                AND service_type = ${type}`
        const connected = result.count > 0 && result[0].access_token
        res.status(200).json({ connected: connected })
    } catch (e) {
        return next(e)
    }
})


export default router