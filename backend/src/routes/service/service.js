import { Router } from "express"
import { z } from "zod"
import sql from "../../db/db.js"
import SpotifyRouter from './spotify.js'
import { getAuthUser } from '../../auth.js'
import { userServicesTypeSchema } from "../../db/schemas/user.js"

const router = Router()

router.use('/spotify', SpotifyRouter)

// Chceck status of user's connection to a service
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
            JOIN
                user_services_t ut
            ON 
                us.service_id = ut.id
            WHERE
                    us.user_id = ${user_id}
                AND
                    ut.service_type = ${type}`
        res.status(200).json({ connected: result.count > 0 })
    } catch (e) {
        return next(e)
    }
})

// Disconnect user from a service
router.delete('/:type/disconnect', async (req, res, next) => {
    try {
        const { type } = z.object({
            type: userServicesTypeSchema
        }).parse(req.params)
        const user_id = getAuthUser(req).id
        const result = await sql`
            DELETE FROM
                user_services
            WHERE 
                    user_id = ${user_id}
                AND
                    service_id = 
                        (SELECT
                            id
                        FROM
                            user_services_t
                        WHERE
                            service_type = ${type})`
        res.status(200).json({ disconnected: result.count > 0 })
    } catch (e) {
        return next(e)
    }
})


export default router