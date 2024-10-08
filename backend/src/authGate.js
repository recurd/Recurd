// Middleware to check if user is authenticated
// By default (no callbacks), authGate responds with status 401 when user is not authenticated
// Otherwise it does nothing and continues the chain of execution
// Callbacks are middlewares, has the parameters (req, res, next)
// sucCb/errCb is called when user is/is not authenticated
export default function authGate({ sucCb, errCb } = {}) {
    return function (req, res, next) {
        // If is logged in
        if (req.session.user) {
            if (sucCb) {
                sucCb(req, res)
            } else {
                next()
            }
        } else {
            if (errCb) {
                errCb(req, res, next)
            } else {
                res.status(401).json({ "message": "You must be logged in to access this" }).end()
            }
        }
    }
}