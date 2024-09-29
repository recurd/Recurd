import { Router } from "express"
import { passport, authGate } from '../passport.js'

const router = Router()

// Login with username and password
// Body: username (string), password (string)
router.post('/password',
    passport.authenticate('local', { failureRedirect: '/404', failureMessage: true }),
    (req, res) => {
        res.status(201).end()
    }
)

router.post('/logout', authGate, (req, res) => {
    req.logout((err) => {
        if (err) { 
            res.status(500).json({"name": e.name, "message": e.message})
            return
        }
        res.status(201).end()
    })
})

export default router