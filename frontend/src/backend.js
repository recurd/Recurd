import axios from 'axios'

const backend = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    timeout: 5000,
    withCredentials: true,
    // tells browser to send cookie-id recieved by the server from the same origin
    headers: {
        'Content-Type': 'application/json' // content type of all requests
    }
})

/* There are three types of errors thrown by axios:
    1. Request sent, server responds with an error like 404, 400 (status code not in 200~299 range)
    2. Request sent, server never responded
    3. No request sent. Error in setting up the request

    These errors will need to be delt with on a per-route basis like so:
    try {
        const res = await backend.get("url")
        // success! do something with res
    } (catch err) {
        if (err.serverResponds) {
            // CASE 1
        } else if (err.requestSent) {
            // CASE 2
        }
        // Ignore CASE 3 since the interceptor will log it
    }
*/

backend.interceptors.request.use((req) => { return req }, 
    (err) => {
    // Remove stack object inside the AxiosError object to improve readability
    // eslint-disable-next-line no-unused-vars
    const {stack: _, ...restErr} = err
    console.error(restErr)      // Log error for case (3)
    return Promise.reject(restErr)
})

backend.interceptors.response.use((res) => { return res }, 
    (err) => {
    // Remove stack object inside the AxiosError object to improve readability
    // eslint-disable-next-line no-unused-vars
    const {stack: _, ...restErr} = err

    // The flag serverResponds is true for case (1), false for case (2)
    restErr.serverResponds = (restErr.response) ? true : false
    // The flag requestSent is true for case (1) and (2), false for case (3)
    restErr.requestSent = (restErr.request) ? true : false

    // Log error for case (3)
    if (!restErr.serverResponds && !restErr.response) {
        console.error(restErr)
    }

    return Promise.reject(restErr)
})


export default backend