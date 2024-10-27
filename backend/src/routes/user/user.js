import { Router } from "express"
import Database from "../../db.js"
import topRouter from './top.js'
import { timestampPaginationSchemaT, idSchema } from "../../schemas/shared.js"
import { userServicesTypeSchema } from "../../schemas/user.js"

const router = Router({mergeParams: true})

router.get('/:user_id/profile', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const profile = await Database.User.getProfile(user_id)
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

        const listens = await Database.User.getListens({
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

router.get('/:user_id/:service_type/currently-listening', async (req, res, next) => {
    try {
        const { user_id, service_type } = z.object({
            user_id: idSchema,
            service_type: userServicesTypeSchema
        }).parse(req.params)

        const connected = await Database.UserService.isConnected(user_id, service_type)
        if (!connected) {
            res.status(200).end()
            // nothing to send
            // do not return information that user is not connected to this service
            // because other users can access this route
        }

        // let response = await fetchCurrListeningTrack(access_token)
        // // Should refresh access token
        // if (!response.success && response.retry) {

        // } else if (!response.success) {
        //     res.status(500).json({ message: response.result })
        // }

        // const track = response.result
        // if (track) {
            
        // }
    } catch(e) {
        return next(e)
    }
    res.status(501).end()
})

export default router