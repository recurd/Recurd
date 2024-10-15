import { Router } from "express"
import { z } from "zod"
import sql from '../db/db.js'
import { DBErrorCodes, isDBError } from "../db/util.js"
import { idSchema } from "../db/schemas/shared.js"

const router = Router()

const paramsIdSchema = z.object({ id: idSchema })

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const [result] = await sql`
            SELECT
                a.*,
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ar.id, 'name', ar.name)) as artists
            FROM
                albums a
            JOIN
                artist_albums aas ON a.id = aas.album_id
            JOIN
                artists ar ON aas.artist_id = ar.id
            WHERE
                a.id = ${id}
            GROUP BY
                a.id`
        res.json(result)
    } catch(e) {
        return next(e)
    }
})

router.get('/:id/songs', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)

        const result = await sql`
            SELECT
                s.*,
                abs.disc_number AS disc_number,
                abs.album_position AS album_position
            FROM
                album_songs abs
            JOIN
                songs s ON abs.song_id = s.id
            WHERE
                abs.album_id = ${id}
            ORDER BY
                abs.disc_number ASC NULLS LAST,
                abs.album_position ASC NULLS LAST,
                s.name DESC`
        res.json(result)
    } catch(e) {
        return next(e)
    }
})

router.get('/:id/ratings', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)

        const result = await sql`
            WITH def AS (
                SELECT 
                    n as rating,
                    0::integer as count
                FROM
                    generate_series(1,10) n
            ), res AS (
                SELECT
                    aos.rating as rating,
                    COUNT(aos.rating)::integer as count
                FROM
                    album_opinions aos
                WHERE
                    aos.album_id = ${id}
                    AND aos.rating IS NOT NULL
                GROUP BY
                    aos.rating
            )
            SELECT * FROM res
            UNION ALL
            SELECT * FROM def
            WHERE NOT EXISTS (
                SELECT * FROM res WHERE res.rating = def.rating
            )
            ORDER BY
                rating ASC
            `
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

router.get('/:id/reviews', async (req, res, next) => {
    // const { id } = paramsIdSchema.parse(req.params)
    res.status(501).end()
})

router.get('/:id/top-listeners', async (req, res, next) => {
    // const { id } = paramsIdSchema.parse(req.params)
    res.status(501).end()
})

export default router