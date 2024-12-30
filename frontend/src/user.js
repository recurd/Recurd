import backend from './backend.js'

async function getStatus() {
    try {
        const res = await backend.get('/auth/status')
        return res.data
    } catch (err) {
        // TODO: display error message
        if (err.serverResponds) {
          console.log("getStatus(): Server responds with status " + err.response.status)
        } else if (err.requestSent) {
          console.log("getStatus(): Server timed out!")
        }
    }
}

export async function isLoggedIn() {
    return (await getStatus())?.logged_in ?? false
}

export async function getID() {
    return (await getStatus())?.user_id
}