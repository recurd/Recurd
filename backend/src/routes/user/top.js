import { Router } from "express"
import { z } from "zod"
import sql from '../../db/db.js'
import { timestampSchemaT, idSchema } from "../../db/schemas/shared.js"

const router = Router({mergeParams: true})

const topSchemaT = z.object({
    start_date: timestampSchemaT,
    end_date: timestampSchemaT.nullish().transform(d => d ? d : new Date()), // defaults to current time
    n: z.number().int().gt(0).lte(100).nullish().default(10)
}).refine(obj =>
    obj.start_date < obj.end_date, {
        message: "start_date must be before end_date"
    })

// Get top (n) artist (id, name, ...), listen count (per artist)
router.get('/artists', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const { start_date, end_date, n } = topSchemaT.parse(req.body)
        const topArtists = await sql`
            SELECT
                ar.*,
                COUNT(DISTINCT l.id) AS listen_count
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
                ar.id
            ORDER BY
                listen_count DESC
            LIMIT ${n}`

        return res.status(200).json(topArtists)
    } catch (e) {
        return next(e)
    }
})

// Get top (n) album (id, name, image), listen count (per album)
router.get('/albums', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const { start_date, end_date, n } = topSchemaT.parse(req.body)
        const topAlbums = await sql`
            SELECT
                a.*,
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ar.id, 'name', ar.name)) as artists,
                COUNT(DISTINCT l.id) AS listen_count
            FROM
                listens l
            JOIN
                album_songs als ON l.song_id = als.song_id
            JOIN
                albums a ON als.album_id = a.id
            JOIN
                artist_albums abs ON a.id = abs.album_id
            JOIN
                artists ar ON abs.artist_id = ar.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp BETWEEN ${start_date} AND ${end_date}
            GROUP BY
                a.id
            ORDER BY
                listen_count DESC
            LIMIT ${n}`

        res.json(topAlbums)
    } catch (e) {
        return next(e)
    }
})


// Get top (n) song (id and name), album_image, artists (array of json)
router.get('/songs', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const { start_date, end_date, n } = topSchemaT.parse(req.body)

        // When a song is linked to multiple albums, some albums will have to be ignored 
        // Since we are only returning one. So we SELECT DISTINCT ON (l.id) and ORDER_BY a.id
        const topSongs = await sql`
            SELECT DISTINCT ON (s.id)
                s.*,
                a.image as album_image,
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ar.id, 'name', ar.name)) as artists,
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
                s.id, a.id
            ORDER BY
                s.id, listen_count DESC
            LIMIT ${n}`

        res.json(topSongs)
    } catch (e) {
        return next(e)
    }
})

export default router