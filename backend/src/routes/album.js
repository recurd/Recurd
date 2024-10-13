import { Router } from "express"
import { z } from "zod"
import sql from '../db/db.js'
import { DBErrorCodes, isDBError } from "../db/util.js"
import { idSchema } from "../db/schemas/shared.js"

const router = Router()

const paramsIdSchema = z.object({ id: idSchema })

router.get('/:id', async (req, res, next) => {
    try {
        const id = paramsIdSchema.parse(req.params)
        // TODO: add aggregated artists
        const result = 
            await sql`SELECT * 
                FROM albums a
                where a.id = ${id}`
        res.json(result)
    } catch(e) {
        if (isDBError(e, DBErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Album id is not a valid uuid!" })
        } else return next(e)
    }
})

router.get('/:id/songs', async (req, res, next) => {
    // const id = paramsIdSchema.parse(req.params)
    res.status(501).end()
})

router.get('/:id/ratings', async (req, res, next) => {
    // const id = paramsIdSchema.parse(req.params)
    res.status(501).end()
})

router.get('/:id/reviews', async (req, res, next) => {
    // const id = paramsIdSchema.parse(req.params)
    res.status(501).end()
})

router.get('/:id/top-listeners', async (req, res, next) => {
    // const id = paramsIdSchema.parse(req.params)
    res.status(501).end()
})

export default router