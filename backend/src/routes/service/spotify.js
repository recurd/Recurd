import { Router } from "express"
import { z } from "zod"
import { connectService } from "recurd-external"
import { authGate, getAuthUser } from "../../auth.js"

const router = Router()

// Expects "auth_code" and "redirect_uri" in the request body
router.post('/connect', authGate(), async (req, res, next) => {
    try {
        const { auth_code, redirect_uri } = z.object({
                auth_code: z.string(),
                redirect_uri: z.string().url()
            }).parse(req.body)
        const user_id = getAuthUser(req).id

        const service = await connectService('spotify', user_id, { auth_code, redirect_uri })
        if (!service) {
            res.status(500).json({ message: 'Failed to connect user to spotify service! Uesr id: '+user_id })
            return
        }
        res.status(201).end()
    } catch (e) {
        return next(e)
    }
})

export default router