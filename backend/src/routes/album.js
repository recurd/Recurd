import { Router } from "express"
import { z } from "zod"
import { getAlbum, getAlbumRatings, getAlbumAvgRating, getAlbumTracks } from "recurd-database/album"
import { idSchema } from "../schemas/shared.js"

const router = Router()

const paramsIdSchema = z.object({ id: idSchema })

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await getAlbum(id)
        res.json(result)
    } catch(e) {
        return next(e)
    }
})

// Tracks differ from songs in that tracks contain info of their location in an album
router.get('/:id/tracks', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await getAlbumTracks(id)
        res.json(result)
    } catch(e) {
        return next(e)
    }
})

// Array of { rating: int, count: int }\
// Note that if a rating is 0, no corresponding object will be returned
router.get('/:id/ratings', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await getAlbumRatings(id)
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})
// { average: int }
router.get('/:id/average-rating', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await getAlbumAvgRating(id)
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

router.get('/:id/reviews', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await getAlbumReviews(id)
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

router.get('/:id/top-listeners', async (req, res, next) => {
    // const { id } = paramsIdSchema.parse(req.params)
    res.status(501).end()
})

export default router