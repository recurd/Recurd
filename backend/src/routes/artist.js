import { Router } from "express"
import { z } from "zod"
import { getArtist, getArtistAlbums, getArtistSongs, getTopListeners } from "recurd-database/artist"
import { DBErrorCodes, isDBError } from "../util.js"
import { idSchema, timestampPaginationSchemaT } from "../schemas/shared.js"

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
        const result = await getArtist(id)
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

        const result = await getArtistAlbums(id, limit)
        res.json(result)
    } catch(e) {
       return next(e)
    }
})

// Note: each song's album json only contains id and image
router.get('/:id/songs', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const { limit } = limitSchema.parse(req.body)
        const result = await getArtistSongs(id, limit)
        res.json(result)
    } catch(e) {
        return next(e)
    }
})

router.get('/:id/top-listeners', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const { start_date, end_date, n } = timestampPaginationSchemaT.parse(req.body)
        const result = await getTopListeners({
            id: id,
            start_date: start_date,
            end_date: end_date,
            n: n
        })
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

export default router