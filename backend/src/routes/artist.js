import { Router } from "express"
import sql from '../db/db.js'
import { ErrorCodes, isDBError } from "../db/util.js"

const router = Router()

router.get('/:id', async (req, res, next) => {
    const id = req.params.id // route parameter always exists
    try {
        const result = 
            await sql`SELECT * 
                from artists a
                where a.id = ${id}`
        res.json(result)
    } catch(e) {
        if (isDBError(e, ErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Artist id is not a valid uuid!" })
        } else return next(e)
    }
})

router.get('/:id/albums', async (req, res, next) => {
    const id = req.params.id
    try {
        // TODO: Add aggregated album's artist info
        const result = 
            await sql`SELECT al.*
            FROM    artist_albums aa
            JOIN    albums al
            ON      aa.album_id = al.id
            WHERE   aa.artist_id = ${id}`
        res.json(result)
    } catch(e) {
        if (isDBError(e, ErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Artist id is not a valid uuid!" })
        } else return next(e)
    }
})

router.get('/:id/songs', async (req, res, next) => {
    const id = req.params.id
    try {
        // TODO: Add aggregated song's artist info
        const result = 
            await sql`SELECT s.*
            FROM    artist_songs ass
            JOIN    song s
            ON      ass.song_id = s.id
            WHERE   ass.artist_id = ${id}`
        res.json(result)
    } catch(e) {
        if (isDBError(e, ErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Artist id is not a valid uuid!" })
        } else return next(e)
    }
})


export default router