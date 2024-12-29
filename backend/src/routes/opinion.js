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

router.post('/song', authGate(), async (req, res, next) => {
    const inputSchemaT = opinionSchemaT(s => s.extend(({ song_id: idSchema })))
    try {
        const { song_id, time_stamp, rating, review } = inputSchemaT.parse(req.body)
        const user_id = getAuthUser(req).id

        const [result] = await Database.Opinion.insertSongOpinion({ user_id, song_id, time_stamp, rating, review })
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

router.post('/album', authGate(), async (req, res, next) => {
    const inputSchemaT = opinionSchemaT(s => s.extend(({ album_id: idSchema })))
    try {
        const { album_id, time_stamp, rating, review } = inputSchemaT.parse(req.body)
        const user_id = getAuthUser(req).id

        const [result] = await Database.Opinion.insertAlbumOpinion({ user_id, album_id, time_stamp, rating, review })
        res.status(200).json(result)
    } catch (e) {
        return next(e)
    }
})

export default router