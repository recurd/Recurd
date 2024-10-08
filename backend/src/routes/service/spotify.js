import { Router } from "express"
import dotenv from 'dotenv'
import sql from "../../db/db.js"
import authGate from "../../authGate.js"
dotenv.config()

const router = Router()

router.use(authGate())

// Expects "auth_code" and "redirect_uri" in the request body
router.post('/auth', async (req, res, next) => {
    const auth_code = req.body.auth_code || null
    const redirect_uri = req.body.redirect_uri

    if (!auth_code || !redirect_uri) {
        res.status(400).json({ message: "auth_code or redirect_uri missing from request body" })
        return
    }

    try {
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
            res.status(500).json({ message: `Connecting to spotify failed (with status ${result.status}${" "+result.statusText})` })
            return
        }

        const { access_token, refresh_token, expires_in	} = await result.json()
        const user_id = req.session.user.id
        const dbRes = await sql`insert into user_services ${
            sql({ 
                user_id: user_id, 
                service_type: 'spotify',
                access_token,
                refresh_token,
                expires_at: sql`now() + interval '${sql((expires_in - 5) +' seconds')}'`
            })} on conflict (user_id, service_type) 
            do update set 
                access_token = excluded.access_token, 
                refresh_token = excluded.refresh_token,
                expires_at = excluded.expires_at`
        if (dbRes.count == 0) {
            res.status(500).json({ message: 'Failed to insert user Spotify service into database' })
            return
        }
        res.status(201).end()
    } catch (e) {
        return next(e)
    }
})

// Move to frontend
// import * as querystring from 'node:querystring'
// router.get('/auth', (req, res) => {
//     let redirect_uri = req.protocol + '://' + req.get('host') + '/api/service/spotify/auth/callback'
//     const scope = 'user-read-playback-state user-read-currently-playing user-read-recently-played'

//     res.redirect('https://accounts.spotify.com/authorize?' +
//         querystring.stringify({
//         response_type: 'code',
//         client_id: process.env.SPOTIFY_CLIENT_ID,
//         scope: scope,
//         redirect_uri: redirect_uri
//         // state: state
//     }))
// })

export default router