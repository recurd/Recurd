import { Router } from "express"
import { z } from "zod"
import sql from '../db/db.js'
import { coerceNumSchemaT, timestampSchemaT, idSchema } from "../db/schemas/shared.js"

const router = Router()

const querySchemaT = z.object({
    user_id: idSchema,
    start_date: timestampSchemaT,
    end_date: timestampSchemaT.nullish().transform(d => d ? d : new Date()), // defaults to current time
    n: coerceNumSchemaT.pipe(z.number().gt(0).lte(100))
})

// Get top (n) artist id, artist name, artist image, listen count (per artist)
router.get('/top-artists', async (req, res, next) => {
    try {
        const { user_id, start_date, end_date, n } = querySchemaT.parse(req.query)
        const topArtists = await sql`
            SELECT
                ar.id AS artist_id,
                ar.name AS artist_name,
                COUNT(*) AS listen_count
            FROM
                listens l
            JOIN
                artist_songs ars ON l.song_id = ars.song_id
            JOIN
                artists ar ON ars.artist_id = ar.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp BETWEEN ${start_date} AND ${end_date}
            GROUP BY
                ar.id, ar.name
            ORDER BY
                listen_count DESC
            LIMIT ${n}`

        return res.status(200).json(topArtists)
    } catch (e) {
        return next(e)
    }
})

// Get top (n) album id, album name, album image, listen count (per album)
router.get('/top-albums', async (req, res, next) => {
    try {
        const { user_id, start_date, end_date, n } = querySchemaT.parse(req.query)
        const topAlbums = await sql`
            SELECT
                a.id AS album_id,
                a.name AS album_name,
                a.image AS album_image,
                COUNT(l.id) AS listen_count
            FROM
                listens l
            JOIN
                album_songs als ON l.song_id = als.song_id
            JOIN
                albums a ON als.album_id = a.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp BETWEEN ${start_date} AND ${end_date}
            GROUP BY
                a.id, a.name, a.image
            ORDER BY
                listen_count DESC
            LIMIT ${n};`

        res.json(topAlbums)
    } catch (e) {
        return next(e)
    }
})


// Get top (n) song id, song name, album name, album image, artist name
router.get('/top-songs', async (req, res, next) => {
    try {
        const { user_id, start_date, end_date, n } = querySchemaT.parse(req.query)
        const topSongs = await sql`
            SELECT
                s.id as song_id,
                s.name as song_name,
                a.name as album_name,
                a.image as album_image,
                ARRAY_AGG(DISTINCT ar.name) as artist_names,
                COUNT(DISTINCT l.id) as listen_count
            FROM
                listens l
            JOIN
                songs s ON l.song_id = s.id
            JOIN
                album_songs als ON s.id = als.song_id
            JOIN
                albums a ON als.album_id = a.id
            JOIN
                artist_songs ars ON s.id = ars.song_id
            JOIN
                artists ar ON ars.artist_id = ar.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp BETWEEN ${start_date} AND ${end_date}
            GROUP BY
                s.id, s.name, a.name, a.image
            ORDER BY
                listen_count DESC
            LIMIT ${n}`

        res.json(topSongs)
    } catch (e) {
        return next(e)
    }
})

// Get a user's recent n listens.
router.get('/recent', async (req, res, next) => {
    try{
        const { user_id, n } = querySchemaT.parse(req.query)
        const recent = await sql `
            SELECT * 
            FROM listens 
            WHERE user_id = ${user_id} 
            ORDER BY time_stamp DESC 
            LIMIT ${n}`

        res.json(recent)
    } catch (e) {
        return next (e)
    }
})

export default router