import { Router } from "express"
import { z } from "zod"
import { getSong, getSongAlbums, getSongRatings, getSongReviews } from "../../../database/src/lib/song.js"
import { DBErrorCodes, isDBError } from "../util.js"
import { idSchema } from "../schemas/shared.js"

const router = Router()

const paramsIdSchema = z.object({ id: idSchema })

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        // TODO: add aggregated artists
        const result = await getSong(id)
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
        const albums = await getSongAlbums(id)
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
        const ratings = await getSongRatings(id)
        res.status(200).json(ratings)
    } catch(e) {
        return next(e)
    }
})

router.get('/:id/reviews', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const reviews = await getSongReviews(id)
        res.status(200).json(reviews)
    } catch(e) {
        return next(e)
    }
})

router.get('/:id/top-listeners', async (req, res, next) => {
    // const { id } = paramsIdSchema.parse(req.params)
    res.status(501).end()
})

export default router