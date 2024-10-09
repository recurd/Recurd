import { Router } from "express"
import authRouter from "./auth.js"
import accountRouter from "./account.js"
import serviceRouter from "./service/service.js"
import artistRouter from "./artist.js"
import albumRouter from "./album.js"
import songRouter from "./song.js"
import dataRouter from "./data.js"


const router = Router()

router.use('/auth', authRouter)
router.use('/account', accountRouter)
router.use('/service', serviceRouter)
router.use('/artist', artistRouter)
router.use('/album', albumRouter)
router.use('/song', songRouter)
router.use('/data', dataRouter)

export default router