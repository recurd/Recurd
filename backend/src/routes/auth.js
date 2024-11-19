import { Router } from "express"
import bcrypt from "bcrypt"
import Database from "../db.js"
import { authGate } from '../auth.js'
import { userSchema } from "../schemas/user.js"

const router = Router()

// Login with username and password
// Body: username (string), password (string)
router.post('/password', async (req, res, next) => {
    try {
        const { username, password } = userSchema.pick({ username: true, password: true}).parse(req.body)

        const user = await Database.User.getByUsername(username)
        if (!user) {
            res.status(400).json({ message: 'Incorrect username or password.' })
            return
        }

        const result = await bcrypt.compare(password, user.password)
        if (result) {
            // serialize user into session
            req.session.user = {
                id: user.id,
                username: user.username,
                display_name: user.display_name,
                image: user.image,
            }
            res.status(200).end()
            return
        }
        res.status(400).json({ message: 'Incorrect username or password.' })
    } catch (err) {
        return next(err)
    }
})

router.post('/logout', authGate(), (req, res) => {
    delete req.session.user
    res.status(200).end()
})

router.get('/status', (req, res) => {
    res.status(200).json({ logged_in: !!req.session.user, user_id: req.session?.user?.id })
})

export default router