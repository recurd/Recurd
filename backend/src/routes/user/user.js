import { Router } from "express"
import { z } from "zod"
import { getUserListens } from "recurd-database/user"
import { getAccessToken } from "recurd-database/userService"
import topRouter from './top.js'
import { timestampSchemaT, idSchema } from "../../schemas/shared.js"
import { userServicesTypeSchema } from "../../schemas/user.js"

const router = Router({mergeParams: true})

router.get('/:user_id/profile', async (req, res, next) => {
    // TODO: implement
    try {
        const user_id = idSchema.parse(req.params.user_id)
    } catch(e) {
        return next(e)
    }
    res.status(501).end()
})

router.use('/:user_id/top', topRouter)

router.get('/:user_id/listens', async (req, res, next) => {
    const isNullish = (e) => e === undefined || e === null
    const listensSchemaT = z.object({
        start_date: timestampSchemaT.nullish(),
        end_date: timestampSchemaT.nullish().transform(d => d ? d : new Date()), // defaults to current time
        n: z.number().int().gt(0).lte(100).nullish()
    }).refine(obj => 
        obj.start_date < obj.end_date, {
        message: "start_date must be before end_date"
    }).refine(obj => 
        !(isNullish(obj.start_date) && isNullish(obj.n)), {
        message: "either start_date or n must be provided"
    })

    try {
        const user_id = idSchema.parse(req.params.user_id)
        const { start_date, end_date, n } = listensSchemaT.parse(req.body)

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

router.get('/:user_id/:service_type/currently-listening', async (req, res, next) => {
    try {
        const { user_id, service_type } = z.object({
            user_id: idSchema,
            service_type: userServicesTypeSchema
        }).parse(req.params)

        const access_token = await getAccessToken(user_id, service_type)
        if (!access_token) {
            res.status(200).end()
            // nothing to send
            // do not return information that user is not connected to this service
            // because other users can access this route
        }

        let response = await fetchCurrListeningTrack(access_token)
        // Should refresh access token
        if (!response.success && response.retry) {

        } else if (!response.success) {
            res.status(500).json({ message: response.result })
        }

        const track = response.result
        if (track) {
            
        }
    } catch(e) {
        return next(e)
    }
    res.status(501).end()
})

export default router