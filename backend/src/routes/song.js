import { Router } from "express"
import { z } from "zod"
import Database from "../db.js"
import { DBErrorCodes, isDBError } from "../util.js"
import { idSchema, timestampPaginationSchema } from "../schemas/shared.js"

const router = Router()

const paramsIdSchema = z.object({ id: idSchema })

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        // TODO: add aggregated artists
        const result = await Database.Song.get(id)
        res.json(result)
    } catch(e) {
        if (isDBError(e, DBErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Song id is not a valid uuid!" })
        } else return next(e)
    }
})

router.get('/:id/albums', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const albums = await Database.Song.getAlbums(id)
        res.status(200).json(albums)
    } catch(e) {
        if (isDBError(e, DBErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Song id is not a valid uuid!" })
        } else return next(e)
    }
})

router.get('/:id/ratings', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const ratings = await Database.Song.getRatings(id)
        res.status(200).json(ratings)
    } catch(e) {
        return next(e)
    }
})

router.get('/:id/reviews', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const reviews = await Database.Song.getReviews(id)
        res.status(200).json(reviews)
    } catch(e) {
        return next(e)
    }
})

router.get('/:id/top-listeners', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const { start_date, end_date, n } = timestampPaginationSchema.parse(req.query)
        const result = await Database.Song.getTopListeners({
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