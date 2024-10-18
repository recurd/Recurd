import { Router } from "express"
import { z } from "zod"
import { initAccessToken } from "recurd-external/spotify"
import { insertUserService } from "recurd-database/userService"
import { authGate, getAuthUser } from "../../auth.js"

const SERVICE_TYPE = 'spotify'

const router = Router()

// Expects "auth_code" and "redirect_uri" in the request body
router.post('/connect', authGate(), async (req, res, next) => {
    try {
        const { auth_code, redirect_uri } = z.object({
                auth_code: z.string(),
                redirect_uri: z.string().url()
            }).parse(req.body)

        const result = await initAccessToken(auth_code, redirect_uri)

        if (!result.success) {
            res.status(500).json({ message: `Connecting to spotify failed: ${result.result})`, error: result.result })
            return
        }

        const { access_token, refresh_token, expires_in	} = result.result
        const user_id = getAuthUser(req).id
        const expires_at = new Date(Date.now()+expires_in * 1000) // add to current epoch time (milliseconds). expires_in is in seconds

        const success = await insertUserService({
            user_id,
            service_type : SERVICE_TYPE,
            access_token : access_token,
            refresh_token: refresh_token,
            expires_at: expires_at
        })
        if (!success) {
            res.status(500).json({ message: 'Failed to insert user Spotify service into database' })
            return
        }
        res.status(201).end()
    } catch (e) {
        return next(e)
    }
})

export default router