import { Router } from "express"
import { z } from "zod"
import Database from "../db.js"
import { authGate, getAuthUser } from "../auth.js"
import { idSchema, timestampSchemaT, coerceNumSchemaT } from "../schemas/shared.js"

const router = Router()

// Since a schema cannot be further changed after refinement (.refine), we use a function with callback
const opinionSchemaT = (callback= ((e) => e)) => { 
    const schema = callback(z.object({
        time_stamp: timestampSchemaT.nullish(),
        rating: coerceNumSchemaT.pipe(z.number().int().min(1).max(10)).nullish(),
        review: z.string().nullish()
    }))
    const isNullish = (e) => e === undefined || e === null

    return schema.refine(obj =>
        !(isNullish(obj.rating) && isNullish(obj.review)), {
        message: "either rating or review must be provided"
    })
}

// create or edit song opinion
// if opinion_id is provided, then it is edited
// otherwise, if a song_id is provided, and a new opinion is created
// opinion_id and song_id cannot both be present at the same time
router.post('/song', authGate(), async (req, res, next) => {
    const inputSchemaT = opinionSchemaT(s => 
        z.union([
            s.extend({ song_id: idSchema }).strict(), // .strict() so that only one of song_id or opinion_id is allowed
            s.extend({ opinion_id: idSchema }).strict()
        ])
    )

    try {
        const body = inputSchemaT.parse(req.body)
        const user_id = getAuthUser(req).id

        // edit opinion
        if (body.opinion_id !== undefined) {
            const result = await Database.Opinion.updateSongOpinion({ user_id, ...body })
            if (result.count === 0) {
                res.status(400).json({ message: "No opinion of the current user is found with this opinion_id" })
                return
            }
            res.status(200).json(result[0])

        // create opinion
        } else {
            const [result] = await Database.Opinion.insertSongOpinion({ user_id, ...body })
            res.status(200).json(result)
        }
    } catch (e) {
        return next(e)
    }
})

// create or edit album opinion
// if opinion_id is provided, then it is edited
// otherwise, album_id must be provided, and a new opinion is created
// opinion_id and album_id cannot both be present at the same time
router.post('/album', authGate(), async (req, res, next) => {
    const inputSchemaT = opinionSchemaT(s => 
        z.union([
            s.extend({ album_id: idSchema }).strict(), // .strict() so that only one of album_id or opinion_id is allowed 
            s.extend({ opinion_id: idSchema }).strict()
        ])
    )
    try {
        const body = inputSchemaT.parse(req.body)
        const user_id = getAuthUser(req).id

        // edit opinion
        if (body.opinion_id !== undefined) {
            const result = await Database.Opinion.updateAlbumOpinion({ user_id, ...body })
            if (result.count === 0) {
                res.status(400).json({ message: "No opinion of the current user is found with this opinion_id" })
                return
            }
            res.status(200).json(result[0])

        // create opinion
        } else {
            const [result] = await Database.Opinion.insertAlbumOpinion({ user_id, ...body })
            res.status(200).json(result)
        }
    } catch (e) {
        return next(e)
    }
})

router.delete('/song', authGate(), async(req, res, next) => {
    try {
        const { opinion_id } = z.object({ opinion_id: idSchema }).parse(req.query)
        const result = await Database.Opinion.deleteSongOpinion({ opinion_id })
        if (result.count === 0) {
            res.status(400).json({ message: "No opinion of the current user is found with this opinion_id" })
            return
        }
        res.status(200).end()
    } catch (e) {
        return next(e)
    }
})

router.delete('/album', authGate(), async(req, res, next) => {
    try {
        const { opinion_id } = z.object({ opinion_id: idSchema }).parse(req.query)
        const result = await Database.Opinion.deleteAlbumOpinion({ opinion_id })
        if (result.count === 0) {
            res.status(400).json({ message: "No opinion of the current user is found with this opinion_id" })
            return
        }
        res.status(200).end()
    } catch (e) {
        return next(e)
    }
})

export default router