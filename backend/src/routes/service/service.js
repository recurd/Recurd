import { Router } from "express"
import { z } from "zod"
import { deleteUserService, getUserServiceStatus } from "recurd-database/userService"
import SpotifyRouter from './spotify.js'
import { getAuthUser } from '../../auth.js'
import { userServicesTypeSchema } from "../../schemas/user.js"

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

        const result = await getUserServiceStatus(user_id, type)
        res.status(200).json({ connected: result })
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
        const result = await deleteUserService(user_id, type)
        res.status(200).json({ disconnected: result })
    } catch (e) {
        return next(e)
    }
})


export default router