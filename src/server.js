import express, { json, urlencoded } from "express"
import session from "express-session"
import { passport } from "./passport.js"
import authRouter from "./routes/auth.js"
import accountRouter from "./routes/account.js"
import dotenv from "dotenv"
dotenv.config()

const server = express();
const PORT = 3000;  // 0 for auto choose address

server.use(json());
server.use(urlencoded({extended:true}));

// Session
const cookieAge = 1000 * 60 * 60 * 24 * 7; // 7 days
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // prevent race condition with parallel storing to sessions of the same user
    saveUninitialized: false, // allow newly created session to be stored
    cookie: {
        maxAge: cookieAge,
        secret: false // true when we have HTTPS
    }
}))

// Passport
server.use(passport.initialize())
server.use(passport.session())


server.get('/', (req, res) => {
    res.status(201).send("Hello!")
})

// Routes
server.use('/auth', authRouter)
server.use('/account', accountRouter)

const listener = server.listen(PORT, function(err) {
    console.log(`Listening on http://localhost:${listener.address().port}`)
})