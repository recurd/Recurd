import { Router } from "express"
import topRouter from './top.js'
import listenRouter from './listens.js'

const router = Router()

router.use('/top', topRouter)
router.use('/listens', listenRouter)

router.get('/profile', async (req, res, next) => {
    res.status(501).end()
})

export default router