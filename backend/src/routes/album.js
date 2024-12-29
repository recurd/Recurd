import { Router } from "express"
import { z } from "zod"
import Database from "../db.js"
import { idSchema, timestampPaginationSchema } from "../schemas/shared.js"

const router = Router()

const paramsIdSchema = z.object({ id: idSchema })

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await Database.Album.get(id)
        res.json(result)
    } catch(e) {
        return next(e)
    }
})

// Tracks differ from songs in that tracks contain info of their location in an album
router.get('/:id/tracks', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await Database.Album.getTracks(id)
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
        const result = await Database.Album.getRatings(id)
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})
// { average: int }
router.get('/:id/average-rating', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await Database.Album.getAvgRating(id)
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

router.get('/:id/reviews', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await Database.Album.getReviews(id)
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

router.get('/:id/top-listeners', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const { start_date, end_date, n } = timestampPaginationSchema.parse(req.query)
        const result = await Database.Album.getTopListeners({
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