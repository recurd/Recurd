import express, { json, urlencoded } from "express"
import session from "express-session"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import morgan from "morgan"
import { ZodError } from "zod"
import { fromZodError } from "zod-validation-error"
import routesRouter from "./routes/routes.js"
import { isDBError } from "./util.js"

const server = express()
const PORT = 3000  // 0 for auto choose address

server.use(json())
server.use(urlencoded({extended:true}))

server.use(morgan('dev'))

// Session
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // prevent race condition with parallel storing to sessions of the same user
    saveUninitialized: false, // allow newly created session to be stored
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        secret: false // true when we have HTTPS
    }
}))

server.use(cors({
    origin: "http://localhost:8080",    // do not end the url with a slash /
    credentials: true
}))

server.get('/', (req, res) => {
    res.status(201).send("Hello!")
})
server.use('/api', routesRouter) // Backend api

// 404
server.use((req, res) => {
    res.status(404).json({ "message": "Route not found" })
})

// Error handling
server.use((err, req, res, next) => {
    if (isDBError(err)) {
        console.error('DB error:', err)
        console.error('Query: ', err.query)
        console.error('Parameters: ', err.parameters) // uncomment this may leak sensitive info to logs
    } else if (err instanceof ZodError) {
        const errMsg = fromZodError(err).message
        console.error('Zod error: ', errMsg)
        err = {
            message: errMsg,
            error: err
        }
    } else {
        console.error('Unknown error:', err)
    }
    const message = err?.message
    if (message) delete err.message
    res.status(500).json({ "message": message, "error": err })
})

const httpServer = server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${httpServer.address().port}`)
})