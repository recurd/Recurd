import { Router } from "express"
import { z } from "zod"
import sql from '../db/db.js'
import { DBErrorCodes, isDBError } from "../db/util.js"
import { coerceNumSchemaT, idSchema } from "../db/schemas/shared.js"

const router = Router()

const paramsIdSchema = z.object({ id: idSchema })
const limitSchema = z.object({ 
    limit: z.union([
        z.number().int().min(1),            // either >= 1
        z.literal(-1).nullish().default(-1) // or -1
    ])
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params) // route parameter always exists
        const result = 
            await sql`SELECT * 
                FROM artists a
                WHERE a.id = ${id}`
        res.json(result)
    } catch(e) {
        if (isDBError(e, DBErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Artist id is not a valid uuid!" })
        } else return next(e)
    }
})

router.get('/:id/albums', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const { limit } = limitSchema.parse(req.body)

        const result = await sql`
            SELECT
                al.*,
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ar.id, 'name', ar.name)) as other_artists
            FROM
                artist_albums aa1
            JOIN
                albums al ON aa1.album_id = al.id
            JOIN
                artist_albums aa2 ON al.id = aa2.album_id
            JOIN
                artists ar ON aa2.artist_id = ar.id
            WHERE
                aa1.artist_id = ${id} 
                AND ar.id <> ${id}
            GROUP BY
                al.id
            ORDER BY
                al.name DESC
            ${ limit > 0 ? 
                sql`LIMIT ${limit}` : sql``}`
        res.json(result)
    } catch(e) {
        if (isDBError(e, DBErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Artist id is not a valid uuid!" })
        } else return next(e)
    }
})

// Note: each song's album json only contains id and image
router.get('/:id/songs', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const { limit } = limitSchema.parse(req.body)

        const result = await sql`
            SELECT DISTINCT ON (s.id)
                s.*,
                JSONB_BUILD_OBJECT('id', al.id, 'image', al.image) as album
            FROM
                artist_songs ass
            JOIN
                songs s ON ass.song_id = s.id
            JOIN
                album_songs als ON s.id = als.song_id
            JOIN
                albums al ON als.album_id = al.id
            WHERE
                ass.artist_id = ${id}
            GROUP BY
                s.id, al.id
            ORDER BY
                s.id, al.name DESC
            ${ limit > 0 ? 
                sql`LIMIT ${limit}` : sql``}`
        res.json(result)
    } catch(e) {
        if (isDBError(e, DBErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Artist id is not a valid uuid!" })
        } else return next(e)
    }
})

router.get('/:id/top-listeners', async (req, res, next) => {
    // const { id } = paramsIdSchema.parse(req.params)
    res.status(501).end()
})

export default router