import { Router } from "express"
import { z } from "zod"
import Database from "../../db.js"
import External from "recurd-external"
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

// Returns object { track: any | null , is_paused: boolean | undefined }
router.get('/:user_id/currently-listening', async (req, res, next) => {
    try {
        const { user_id } = z.object({
            user_id: idSchema
        }).parse(req.params)

        const services = await Database.User.getServices(user_id)

        // Find any currently listening songs from connected services, return first found
        for (const s_type of services) {
            const service = await External.findService(s_type, user_id)
            if (!service) {
                console.error(`recurd-external cannot find service ${s_type} for a user when it should exist`)
                res.status(500).end()
                return
            }

            const listening = await service.getCurrentlyListening()
            if (listening.track) {
                res.status(201).json(listening)
                return
            }
        }
        res.status(200).json({ track: null })
    } catch(e) {
        return next(e)
    }
})

// TEMPORARY ROUTE, will change once we implement cron jobs
router.get('/:user_id/recent-listens-temp', async (req, res, next) => {
    try {
        const user_id = idSchema.parse(req.params.user_id)
        const services = await Database.User.getServices(user_id)
        const listens = []
        for (const s_type of services) {
            const service = await External.findService(s_type, user_id)
            if (!service) {
                console.error(`recurd-external cannot find service ${s_type} for a user when it should exist`)
                continue
            }
            const slistens = await service.getRecentListens()
            if(slistens.length > 0) listens.push(slistens)
        }
        res.status(200).json({ listens: listens }).end()
    } catch(e) {
        return next(e)
    }
})

export default router