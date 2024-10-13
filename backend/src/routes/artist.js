import { Router } from "express"
import { z } from "zod"
import sql from '../db/db.js'
import { DBErrorCodes, isDBError } from "../db/util.js"
import { idSchema } from "../db/schemas/shared.js"

const router = Router()

const paramsIdSchema = z.object({ id: idSchema })

router.get('/:id', async (req, res, next) => {
    try {
        const id = paramsIdSchema.parse(req.params) // route parameter always exists
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
        const id = paramsIdSchema.parse(req.params)
        // TODO: Add aggregated album's artist info
        const result = 
            await sql`SELECT al.*
            FROM    artist_albums aa
            JOIN    albums al
            ON      aa.album_id = al.id
            WHERE   aa.artist_id = ${id}`
        res.json(result)
    } catch(e) {
        if (isDBError(e, DBErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Artist id is not a valid uuid!" })
        } else return next(e)
    }
})

router.get('/:id/songs', async (req, res, next) => {
    try {
        const id = paramsIdSchema.parse(req.params)
        // TODO: Add aggregated song's artist info
        const result = 
            await sql`SELECT s.*
            FROM    artist_songs ass
            JOIN    song s
            ON      ass.song_id = s.id
            WHERE   ass.artist_id = ${id}`
        res.json(result)
    } catch(e) {
        if (isDBError(e, DBErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Artist id is not a valid uuid!" })
        } else return next(e)
    }
})

router.get('/:id/top-listeners', async (req, res, next) => {
    // const id = paramsIdSchema.parse(req.params)
    res.status(501).end()
})

export default router