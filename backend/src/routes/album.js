import { Router } from "express"
import { z } from "zod"
import { getAlbum, getAlbumSongs, getAlbumRatings } from "recurd-database/album"
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

router.get('/:id/songs', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await getAlbumSongs(id)
        res.json(result)
    } catch(e) {
        return next(e)
    }
})

router.get('/:id/ratings', async (req, res, next) => {
    try {
        const { id } = paramsIdSchema.parse(req.params)
        const result = await getAlbumRatings(id)
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