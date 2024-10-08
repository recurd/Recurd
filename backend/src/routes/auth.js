import { Router } from "express"
import bcrypt from "bcrypt"
import sql from '../db/db.js'
import authGate from '../authGate.js'

const router = Router()

// Login with username and password
// Body: username (string), password (string)
router.post('/password', async (req, res, next) => {
    try {
        const username = req.body.username
        const password = req.body.password
        if (!username || !password) {
            res.status(400).json({ "message": "Email or password field missing from request body" })
            return 
        }

        const users = await sql`select * from users where username = ${username}`
        if (users.count == 0) {
            res.status(400).json({ message: 'Incorrect username or password.' })
            return
        }
        const user = users[0]

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

export default router