import { Router } from "express"
import sql from '../db/db.js'
import { ErrorCodes, isDBError } from "../db/util.js"

const router = Router()

router.get('/:id', async (req, res, next) => {
    const id = req.params.id
    try {
        // TODO: add aggregated artists
        const result = 
            await sql`SELECT * 
                FROM albums a
                where a.id = ${id}`
        res.json(result)
    } catch(e) {
        if (isDBError(e, ErrorCodes.INVALID_TEXT_REPRESENTATION)) {
            res.status(400).json({ "message": "Album id is not a valid uuid!" })
        } else return next(e)
    }
})

router.get('/:id/songs', async (req, res, next) => {
    const id = req.params.id
    res.status(501).end()
})

router.get('/:id/ratings', async (req, res, next) => {
    const id = req.params.id
    res.status(501).end()
})

router.get('/:id/reviews', async (req, res, next) => {
    const id = req.params.id
    res.status(501).end()
})

router.get('/:id/top-listeners', async (req, res, next) => {
    const id = req.params.id
    res.status(501).end()
})

export default router