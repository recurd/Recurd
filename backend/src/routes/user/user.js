import { Router } from "express"
import { getUserListens, getUserProfile } from "recurd-database/user"
import topRouter from './top.js'
import { timestampPaginationSchemaT, idSchema } from "../../schemas/shared.js"

const router = Router({mergeParams: true})

router.get('/:user_id/profile', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const profile = await getUserProfile(user_id)
        if (!profile) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json(profile)
    } catch(e) {
        next(e)
    }
})

router.use('/:user_id/top', topRouter)

router.get('/:user_id/listens', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const { start_date, end_date, n } = timestampPaginationSchemaT.parse(req.body)

        const listens = await getUserListens({
            user_id: user_id,
            start_date: start_date,
            end_date: end_date,
            n: n
        })
        res.status(200).json({ listens: listens })
    } catch (e) {
        return next(e)
    }
})

router.get('/:user_id/currently-listening', async (req, res, next) => {
    // TODO: implement spotify stuff first then this? idk
    try {
        const user_id = idSchema.parse(req.params.user_id)
    } catch(e) {
        return next(e)
    }
    res.status(501).end()
})

export default router