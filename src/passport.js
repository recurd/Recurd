import passport from "passport"
import LocalStrategy from "passport-local"
import bcrypt from "bcrypt"
import sql from './db/db.js'

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const users = await sql`select * from users where username = ${username}`
        if (users.count == 0) return cb(null, false, { message: 'Incorrect username or password.' })
        const user = users[0]

        const result = await bcrypt.compare(password, user.password)
        if (result) {
            return cb(null, user)
        }
        return cb(null, false, { message: 'Incorrect username or password.' })
    } catch (err) {
        return cb(err)
    }
}))

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, {
            id: user.id,
            username: user.username,
            display_name: user.display_name,
            image: user.image,
        })
    })
})

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    })
})

// Middleware to check if user is authenticated
function authGate(req, res, next) {
    if (!req.user) {
        res.status(401).end()
        return
    }
    next()
}

export { passport, authGate }