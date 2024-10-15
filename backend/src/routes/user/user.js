import { Router } from "express"
import topRouter from './top.js'
import sql from '../../db/db.js'
import { z } from "zod"
import { timestampSchemaT, idSchema } from "../../db/schemas/shared.js"

const router = Router({mergeParams: true})

router.get('/:user_id/profile', async (req, res, next) => {
    // TODO: implement
    try {
        const user_id = idSchema.parse(req.params.user_id)
    } catch(e) {
        return next(e)
    }
    res.status(501).end()
})

router.use('/:user_id/top', topRouter)

router.get('/:user_id/listens', async (req, res, next) => {
    const isNullish = (e) => e === undefined || e === null
    const listensSchemaT = z.object({
        start_date: timestampSchemaT.nullish(),
        end_date: timestampSchemaT.nullish().transform(d => d ? d : new Date()), // defaults to current time
        n: z.number().int().gt(0).lte(100).nullish()
    }).refine(obj => 
        obj.start_date < obj.end_date, {
        message: "start_date must be before end_date"
    }).refine(obj => 
        !(isNullish(obj.start_date) && isNullish(obj.n)), {
        message: "either start_date or n must be provided"
    })

    try {
        const user_id = idSchema.parse(req.params.user_id)
        const { start_date, end_date, n } = listensSchemaT.parse(req.body)

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
                AND l.time_stamp 
                    ${start_date ? 
                        sql`BETWEEN ${start_date} AND ${end_date}` : 
                        sql`<= ${end_date}`}
            GROUP BY
                l.id, s.id, a.id
            ORDER BY
                l.id, time_stamp, a.id 
                DESC
            ${!isNullish(n) ? sql`LIMIT ${n}` : sql``}`
            res.status(200).json({ listens })
    } catch (e) {
        return next(e)
    }
})

router.get('/:user_id/currently-listening', async (req, res, next) => {
    // TODO: implement spotify stuff first then this? idk
    try {
        const user_id = idSchema.parse(req.params.user_id)
    } catch(e) {
        return next(e)
    }
    res.status(501).end()
})

export default router