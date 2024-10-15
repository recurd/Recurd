import { Router } from "express"
import { z } from "zod"
import sql from '../../db/db.js'
import { timestampSchemaT, idSchema } from "../../db/schemas/shared.js"

const router = Router()
const listensSchemaT = z.object({
    user_id: idSchema,
    start_date: timestampSchemaT,
    end_date: timestampSchemaT.nullish().transform(d => d ? d : new Date()) // defaults to current time
}).refine(obj =>
    obj.start_date < obj.end_date, {
        message: "start_date must be before end_date"
    })


router.get('/', async (req, res, next) => {
    try {
        const { user_id, start_date, end_date } = listensSchemaT.parse(req.body)

        // When a song is linked to multiple albums, some albums will have to be ignored 
        // Since we are only returning one. So we SELECT DISTINCT ON (l.id) and ORDER_BY a.id
        const listens = await sql`
            SELECT DISTINCT ON (l.id)
                l.id as listen_id,
                l.time_stamp as time_stamp,
                ROW_TO_JSON(s) as song,
                ROW_TO_JSON(a) as album,
                -- JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', a.id, 'name', a.name)) as album,
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ar.id, 'name', ar.name)) as artists
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
                l.id, s.id, a.id
            ORDER BY
                l.id, time_stamp, a.id 
                DESC`
            res.status(200).json({ listens })
    } catch (e) {
        return next(e)
    }
})

export default router