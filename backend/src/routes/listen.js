import { Router } from "express"
import sql from '../db/db.js'
import authGate from "../authGate.js"
import { isDBError } from "../db/util.js"
import { insertOrFindArtists } from "../db/metadata.js"

const router = Router()

// Returns listen_id, song_id, artists (id, name, image per artist), album (id, name, and image)
router.post('/log', authGate(), async (req, res, next) => {
    const { 
        song_name, 
        artist_names
    } = req.body
    if (!song_name || !artist_names || 
        !Array.isArray(artist_names) || artist_names.length == 0) {
        res.status(400).json({ message: "song_name and artist_names (an array of at least one name) is required!" })
        return
    }
    let { artist_metadatas } = req.body
    if (!artist_metadatas) artist_metadatas = artist_names.map(_=>{ return {}})
    if (!Array.isArray(artist_metadatas) || artist_names.length != artist_metadatas.length) {
        res.status(400).json({ message: "artist_metadatas' length must be the same as artist_names' length (if present)" })
        return
    }

    // optional fields
    const {
        album_name,
        song_metadata,
        album_metadata,
        time_stamp = Date.now() / 1000
    } = req.body
    const user_id = req.session.user.id // derived from login

    // Check if length of artist_metadatas match artist_names
    if (artist_metadatas && artist_metadatas.length != artist_names.length) {
        res.status(400).json({ "message": "artist_metadatas's length must match artist_names if it is not null" })
        return
    }

    // See Planning doc
    // WARNING: This feature is not concurrently safe at all!! (yet)
    try {
        const result = await sql.begin(async sql => {
            let song = null
            let artists = []
            let album = null

            // Find song and artists by exact match on song name and artist names
            const [matchedSA] = await sql`
                SELECT 
                        row_to_json(s) song,
                        json_agg(row_to_json(ar)) artists
                FROM    songs s
                JOIN    artist_songs ars
                ON      s.id = ars.song_id
                JOIN    artists ar
                ON      ars.artist_id = ar.id
                WHERE   s.name = ${song_name}
                GROUP BY s.id
                HAVING  array_agg(ar.name) @> ${artist_names}
                    AND array_agg(ar.name) <@ ${artist_names};` // set equality (of arrays)

            // If a match is encountered, the song exists, so retrieve data
            if (matchedSA) {
                song = matchedSA.song
                artists = matchedSA.artists
                song.found = true
                artists = artists.map(e=>{ return {...e, found: true} })
            }
            // Otherwise, insert all artists whose names are not present
            // Then insert song, and insert into artist_songs
            else {
                // Insert artists
                for (let i = 0; i < artist_names.length; i++) {
                    artist_metadatas[i].name = artist_names[i]
                }
                artists = await insertOrFindArtists(artist_metadatas)

                // Insert song
                const [res_song] = await sql`
                    INSERT INTO songs ${sql({ ...song_metadata, name: song_name})}
                    RETURNING *`
                song = { ...res_song, found: false }
                console.log('song created with id: ', song.id)

                // Insert artist_song entry
                const artist_song_inserts = artists.map(e => { // build values to insert into artist songs
                    return {
                        artist_id: e.id,
                        song_id: song.id
                    }
                }) 
                await sql`INSERT INTO artist_songs ${sql(artist_song_inserts)}`
            }

            // Insert listen
            const [{ listen_id, res_timestamp }] = await sql`
                INSERT INTO listens ${sql( 
                    {time_stamp: time_stamp ?? undefined, 
                    user_id, song_id: song.id })}
                RETURNING id, EXTRACT (EPOCH FROM time_stamp)`

            // If song was found (not created), fetch album by name
            if (song.found) {
                const [resAlbum] = await sql`
                    SELECT *
                    FROM songs s
                    JOIN album_songs abs
                    ON s.id = abs.song_id
                    JOIN albums ab
                    ON abs.album_id = ab.id
                    WHERE s.id = ${song.id}
                        ${album_name ? sql`AND ab.name = ${album_name}` : sql``}
                    LIMIT 1`
                album = resAlbum
            }

            // Find album
            if (album_name && !album) { // haven't found album
                // Get album's artists names (prioritizing album's metadata info, but if not exists, use song's artist ames)
                const album_artist_names = 
                    album_metadata?.artists ?
                    album_metadata.artists.map(e=>e.name) : 
                        artist_names
                
            }

            return {
                listen_id,
                song, 
                artists,
                album,
                res_timestamp
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