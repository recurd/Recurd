import { Router } from "express"
import SpotifyRouter from './spotify.js'

const router = Router()

router.use('/spotify', SpotifyRouter)

export default router