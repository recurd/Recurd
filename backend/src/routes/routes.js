import { Router } from "express"
import authRouter from "./auth.js"
import accountRouter from "./account.js"
import serviceRouter from "./service/service.js"
import dataRouter from "./data.js"


const router = Router()

router.use('/auth', authRouter)
router.use('/account', accountRouter)
router.use('/service', serviceRouter)
router.use('/data', dataRouter)

export default router