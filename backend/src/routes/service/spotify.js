import { Router } from "express"
import * as querystring from 'node:querystring'
import dotenv from 'dotenv'
import sql from "../../db/db.js"
import authGate from "../../authGate.js"
dotenv.config()

const router = Router()

router.use(authGate())

router.post('/auth', (req, res) => {
    // calculate redirect uri from current uri minus '/auth' + '/callback'
    let redirect_uri = (req.protocol + '://' + req.get('host') + req.originalUrl)
    redirect_uri = redirect_uri.substring(0, redirect_uri.length - req.path.length) + '/callback'
    const scope = 'user-read-playback-state user-read-currently-playing user-read-recently-played'

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: redirect_uri
        // state: state
    }))
})

router.get('/callback', async (req, res, next) => {
    const auth_code = req.query.code || null
    const redirect_uri = req.protocol + '://' + req.get('host') + req.originalUrl

    if (!auth_code) {
        res.status(500).json({ message: req.query.error })
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
                expires_at: sql`now() + interval '${expires_in}' seconds`
            })} on conflict update`
        if (dbRes.count == 0) {
            res.status(500).json({ message: 'Failed to insert user Spotify service into database' })
            return
        }
        res.status(201).end()
    } catch (e) {
        return next(e)
    }
})

export default router