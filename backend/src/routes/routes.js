import { Router } from "express"
import authRouter from "./auth.js"
import accountRouter from "./account.js"
import serviceRouter from "./service/service.js"


const router = Router()

router.use('/auth', authRouter)
router.use('/account', accountRouter)
router.use('/service', serviceRouter)

export default router