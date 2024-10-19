import { Router } from "express"
import bcrypt from "bcrypt"
import { insertUser } from "recurd-database/user"
import { DBErrorCodes as DBErrorCodes, isDBError } from '../util.js'
import { authGate } from "../auth.js"
import { userSchemaT } from "../schemas/user.js"

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
        try {
            const { username, password } = userSchemaT.pick({ username: true, password: true}).parse(req.body)

            const hash = await bcrypt.hash(password, 10)
            const dbRes = await insertUser({ 
                username: username,
                password: hash,
                display_name: username
            })

            if (dbRes.count == 0) {
                res.status(500).json({ message: 'Failed to insert new account into database' })
                return
            }
            res.status(201).end()
        } catch (e) {
            if (isDBError(e, DBErrorCodes.UNIQUE_VIOLATION)) {
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