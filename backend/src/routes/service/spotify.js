import { Router } from "express"
import { z } from "zod"
import dotenv from 'dotenv'
import { authGate, getAuthUser } from "../../auth.js"
import { insertUserService } from "../../db/userService.js"
dotenv.config()

const router = Router()

router.use(authGate())

// Expects "auth_code" and "redirect_uri" in the request body
router.post('/connect', async (req, res, next) => {
    try {
        const { auth_code, redirect_uri } = z.object({
                auth_code: z.string(),
                redirect_uri: z.string().url()
            }).parse(req.body)

        const result = await fetch('https://accounts.spotify.com/api/token',  {
            method: 'POST',
            body: new URLSearchParams({ // for urlencoded body
                code: auth_code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer
                    .from(process.env.SPOTIFY_CLIENT_ID + ':' + 
                        process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
            }
        })

        if (!result.ok) {
            const error = await result.json()
            res.status(500).json({ message: `Connecting to spotify failed (with status ${result.statusText}${": "+error.error_description})`, error: error })
            return
        }

        const { access_token, refresh_token, expires_in	} = await result.json()
        const user_id = getAuthUser(req).id
        const expires_at = new Date(Date.now()+expires_in * 1000) // add to current epoch time (milliseconds). expires_in is in seconds

        const success = await insertUserService({
            user_id,
            service_type : 'spotify',
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