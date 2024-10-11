import { Router } from "express"
import sql from '../db/db.js'
import authGate from "../authGate.js"

const router = Router()

// Returns listen_id, song_id, artists (id, name, image per artist), album (id, name, and image)
router.post('/log', authGate(), async (req, res, next) => {
    const { song_name, artist_names } = req.body
    if (!song_name || !artist_names || Array.isArray(artist_names) || artist_names.length == 0) {
        res.status(400).json({ message: "song_name and artist_name (an array of at least one name) is required!" })
        return
    }

    // optional fields
    const {
        album_name,
        song_metadata,
        artist_metadatas,
        album_metadata,
        timestamp = Date.now() / 1000
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

            // Match song name and artist names
            const [matchedSA] = await sql`
                SELECT 
                        json_agg(row_to_json(s)) song
                        json_agg(row_to_json(ar)) artists
                FROM    songs s
                JOIN    artist_songs ars
                ON      s.id = ars.song_id
                JOIN    artists ar
                ON      ars.artist_id = ar.id
                WHERE   s.name = ${song_name}
                GROUP BY s.id
                HAVING  array_agg(ar.name) = ${artist_names};`

            // If a match is encountered, the song exists, so retrieve data
            if (matchedSA) {
                song = matchedSA.song
                artists = matchedSA.artists
            }
            // Otherwise, insert all artists whose names are not present
            // Then insert song, and insert into artist_songs
            else {
                // Insert artists
                // create temp table with same type as artists (excluding id column)
                await sql`
                    CREATE TEMPORARY TABLE temp_artists (LIKE artists); 
                    ALTER TABLE temp_artists DROP COLUMN id`.simple()
                for (const [i, name] of artist_names.entries()) {
                    // let metadata = null
                    // if (artist_metadatas) metadata = artist_metadatas[i]
                    await sql`INSERT INTO temp_artists ${sql({...artist_metadatas[i], name})}`
                }
                artists = await sql`
                    WITH existed as (
                        SELECT * FROM artists 
                        WHERE name in (
                            SELECT name FROM temp_artists
                        )
                    ), inserted as (
                        INSERT INTO artists (name, image, description)
                        SELECT DISTINCT ON (name) *
                        FROM temp_artists ta
                        WHERE NOT EXISTS (
                            SELECT name FROM existed WHERE name = ta.name
                        )
                        RETURNING *
                    )
                    SELECT * FROM existed
                    UNION
                    SELECT * FROM inserted`
                console.log('artists created and/or found:', artists)
                sql`DROP TABLE temp_artists`

                // Insert song
                const [res_song] = await sql`
                    INSERT INTO songs (name, image)
                    VALUES (${song_name, song_metadata?.image})
                    RETURNING *`
                song = res_song
                console.log('song created with id: ', song.id)

                // Insert artist_song entry
                const artist_song_inserts = artists.map(e => { // build values to insert into artist songs
                    return {
                        artist_id: e.artist_id,
                        song_id: song.id
                    }
                }) 
                sql`INSERT INTO artist_songs ${sql(artist_song_inserts)}`
            }

            // Insert listen
            const [{ listen_id, res_timestamp }] = await sql`
                INSERT INTO listens ${sql(timestamp, user_id, song.id)}
                RETURNING id, EXTRACT (EPOCH FROM timestamp)`

            // Match album
            if (album_name) {
                // Get album's artists names (prioritizing album's metadata info, but if not exists, use song's artist ames)
                let album_artists = artist_names
                if (album_metadata?.artists) {
                    album_artists = []
                    for (const artist in album_metadata.artists) {
                        album_artists.append(artist['name'])
                    }
                }
            }

            return {
                listen_id,
                song, 
                artists,
                album,
                res_timestamp
            }
        })
    } catch (e) {
        return next(e)
    }
})

export default router