import { Router } from "express"
import sql from '../db/db.js'
import authGate from "../authGate.js"
import { isDBError } from "../db/util.js"
import { findOrInsertSongArtistAlbum } from "../db/metadata.js"

const router = Router()

// Assumes artists is an array and non-empty
function validArtistsArray(artists) {
    // check if it is of string or object type
    const type = typeof artists[0]
    if (type !== 'string' && type !== 'object') return false
    for (let i = 1; i < artists.length; i++) {
        // Check if type is expected
        if (typeof artists[i] !== type) return false
        // Check if name exists if it is object type
        if (type === 'object' && !artists[i]?.name) return false
    }
    return true
}

// Required: song name and artists (array of string artist names or artist objects with 'name' field) with length at least 1
// Returns listen_id, song_id, artists (id, name, image per artist), album (id, name, and image)
router.post('/log', authGate(), async (req, res, next) => {
    const { 
        song_name, 
        artists
    } = req.body
    const user_id = req.session.user.id // derived from login
    if (!song_name || !artists || 
        !Array.isArray(artists) || artists.length == 0) {
        res.status(400).json({ message: "song_name and artists (an array of at least one) is required!" })
        return
    }
    if (!validArtistsArray(artists)) {
        res.status(400).json({ message: "artists must either be an array of string or an array of json objects (with 'name' field for each artist)" })
        return
    }

    // optional fields
    const {
        song_metadata,
        album,
        time_stamp
    } = req.body
    if (time_stamp && !Number.isInteger(time_stamp)) {
        res.status(400).json({ "message": "time_stamp must be an integer (epoch time in seconds)" })
        return
    }
    const albumIn = typeof album === 'string' ? { name: album } : album // possible null/undefined
    if (albumIn?.artists && !Array.isArray(albumIn?.artists)) {
        res.status(400).json({ "message": "album's artists must be an array"})
        return
    }
    if (albumIn?.artists && albumIn.artists.length !== 0 &&
        !validArtistsArray(albumIn.artists)) {
        res.status(400).json({ "message": "album's artists array is not valid"})
        return
    }

    // See Planning doc
    try {
        const result = await sql.begin(async sql => {
            // Convert artists from string into object array, if necessary
            const songArtists = artists.map(e => {
                if (typeof e === 'string') 
                    return { name: e }
                return e
            })
            console.log(songArtists)

            const albumArtists = (!albumIn?.artists || albumIn?.artists?.length == 0) ? songArtists : albumIn?.artists

            const { song, album } = await findOrInsertSongArtistAlbum(
                    { ...song_metadata, name: song_name } , 
                    songArtists, 
                    albumIn, 
                    albumArtists)
            // Insert listen
            const listenInsert = { user_id, song_id: song.id }
            if (time_stamp) listenInsert.timestamp = time_stamp
            const [{ listen_id, res_timestamp }] = await sql`
                INSERT INTO listens ${sql(listenInsert)}
                RETURNING id, (EXTRACT (EPOCH FROM time_stamp)::integer) as res_timestamp`

            return {
                listen_id,
                song,
                artists: song.artists,
                album,
                time_stamp: res_timestamp
            }
        })

        res.status(200).json(result)
    } catch (e) {
        // TEMP
        if (isDBError(e)) {
            console.error('Query: ', e.query)
            console.error('Parameters: ', e.parameters) // uncomment this may leak sensitive info to logs
        } 
        return next(e)
    }
})

export default router