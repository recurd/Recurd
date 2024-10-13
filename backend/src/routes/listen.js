import { Router } from "express"
import sql from '../db/db.js'
import authGate from "../authGate.js"
import { findOrInsertSongArtistAlbum, insertListen } from "../db/metadata.js"

const router = Router()

// Required: song name and artists (array of string artist names or artist objects with 'name' field) with length at least 1
// Returns listen_id, song_id, artists (id, name, image per artist), album (id, name, and image)
router.post('/log', authGate(), async (req, res, next) => {
    const { 
        song_name, 
        artists,
        // optional fields
        song_metadata,
        album,
        time_stamp
    } = req.body
    const user_id = req.session.user.id // derived from login

    try {
        const result = await sql.begin(async sql => {
            const { song, album: outAlbum } = await findOrInsertSongArtistAlbum({
                    song: { ...song_metadata, name: song_name }, 
                    songArtists: artists, 
                    album, 
                    albumArtists: album?.artists 
                }, sql)
            // Insert listen
            const { listen_id, time_stamp: res_timestamp } = await insertListen({ user_id, song_id: song.id, time_stamp }, sql)
            return {
                listen_id,
                song,
                artists: song.artists,
                album: outAlbum,
                time_stamp: res_timestamp
            }
        })

        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

export default router