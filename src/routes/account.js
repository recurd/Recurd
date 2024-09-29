import { Router } from "express"
import sql from '../db/db.js'
import { ErrorCodes as PgErrorCodes, isDBError } from '../db/util.js'
import bcrypt from "bcrypt"
import { authGate } from "../passport.js"

const router = Router()

// Creates account with username and password (uses username as default display_name)
// Body: username (string), password (string)
router.post('/create/password', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
        res.status(400).json({"errorMsg": "Email or password field missing from request body"})
        return 
    }

    try {
        const hash = await bcrypt.hash(password, 10)
        await sql`insert into users ${sql({ username, password: hash, display_name: username})}`
        res.status(201).end()
    } catch (e) {
        console.log('error', e)
        if (isDBError(e, PgErrorCodes.UNIQUE_VIOLATION)) {
            res.status(400).json({"name": e.name, "message": "Username already exists!", "error": e})
        } else {
            res.status(500).json({"name": e.name, "message": e.message})
            throw e
        }
    }
})

// Routes starting from here requires user to be logged in
router.use(authGate)

router.post('/edit', (req, res) => {
    console.log("test")
    res.status(201).end()
})

export default router