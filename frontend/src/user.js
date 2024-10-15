import backend from './backend.js'

async function getStatus() {
    try {
        const res = await backend.get('/auth/status')
        return res.data
    } catch (err) {
        // TODO: display error message
        if (err.serverResponds) {
          console.log("Server responds with status " + err.response.status)
        } else if (err.requestSent) {
          console.log("Server timed out!")
        }
    }
}

async function isLoggedIn() {
    return (await getStatus()).loggedIn
}

async function getID() {
    return (await getStatus()).user_id
}

export default {
    isLoggedIn,
    getID
}