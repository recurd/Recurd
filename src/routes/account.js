import { Router } from "express"
import bcrypt from "bcrypt"
import sql from '../db/db.js'
import { ErrorCodes as PgErrorCodes, isDBError } from '../db/util.js'
import authGate from "../authGate.js"

const router = Router()

// Creates account with username and password (uses username as default display_name)
// Body: username (string), password (string)
router.post('/create/password', 
    authGate({ 
        sucCb: (req, res) => {
            res.status(400).json({ "message": "Cannot create account when there is an user logged in" })
        }, errCb: (req, res, next) => {
            next()
        }
    }),
    async (req, res, next) => {
        const username = req.body.username
        const password = req.body.password
        if (!username || !password) {
            res.status(400).json({ "message": "Email or password field missing from request body" })
            return 
        }

        try {
            const hash = await bcrypt.hash(password, 10)
            const dbRes = await sql`insert into users ${sql({ username, password: hash, display_name: username })}`
            if (dbRes.count == 0) {
                res.status(500).json({ message: 'Failed to insert new account into database' })
                return
            }
            res.status(201).end()
        } catch (e) {
            if (isDBError(e, PgErrorCodes.UNIQUE_VIOLATION)) {
                res.status(400).json({ "message": "Username already exists!", "error": e })
            } else return next(e)
        }
    }
)

// Routes starting from here requires user to be logged in
router.use(authGate())

router.post('/edit', (req, res) => {
    res.status(501).end()
})

export default router