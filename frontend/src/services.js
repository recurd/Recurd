import { redirect } from 'react-router-dom'
import backend from './backend.js'

export const servicesCallbackPath = {
  SPOTIFY: "/service/spotify-callback"
}

export async function isServiceConnected(service_type) {
    try {
        const res = await backend.get('/service/'+service_type+'/status')
        return res.data.connected
    } catch (err) {
        // TODO: display error message
        if (err.serverResponds) {
            console.log("getServiceStatus(): Server responds with status " + err.response.status)
        } else if (err.requestSent) {
            console.log("getServiceStatus(): Server timed out!")
        }
        return false
    }
}

// used in loader to pass response to query parameter
// returns { success: bool, message: string }
export async function connectSpotify(auth_code, redirect_uri) {
    try {
        await backend.post('/service/spotify/connect', {
            auth_code,
            redirect_uri
        })
        return { success: true, message: null } // Connect spotify button is in settings
        // NOTE: It is impossible to store dynamically where we should redirect to because 
        // a new instance of react is created when spotify redirects back
        // Also, we cannot change the redirect_uri provided to spotify as it as to be static, otherwise access is denied
    } catch (e) {
        // Grab server's error message
        if (e.serverResponds && e.response.data?.error?.error_description) {
            return { success: false, message: e.response.data.error.error_description }
        } else {
            return { success: false, message: e.response?.statusText } // what if request never sent?
        }
    }
}

export async function disconnectSpotify() {
    try {
        const res = await backend.delete('/service/spotify/disconnect')
        return { success: res.data.disconnected, message: null } // Connect spotify button is in settings
        // NOTE: It is impossible to store dynamically where we should redirect to because 
        // a new instance of react is created when spotify redirects back
        // Also, we cannot change the redirect_uri provided to spotify as it as to be static, otherwise access is denied
    } catch (e) {
        // Grab server's error message
        if (e.serverResponds && e.response.data?.error?.error_description) {
            return { success: false, message: e.response.data.error.error_description }
        } else {
            return { success: false, message: e.response?.statusText } // what if request never sent?
        }
    }
}

export async function spotifyRedirLoader({ request }) {
    const url = new URL(request.url)
    const redirect_uri = url.origin + url.pathname // no search params
    const auth_code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    const redirQParams = new URLSearchParams({
        success: false, 
        service_type: "spotify", 
        message: null
    })

    if (error) {
        redirQParams.set('message', error)
        return redirect('/settings?'+redirQParams.toString()) // return value to page, which can be accessed by useLoaderData hook
    } else {
        const { success, message } = await connectSpotify(auth_code, redirect_uri)
        redirQParams.set('success', success)
        redirQParams.set('message', message)
        return redirect('/settings?'+redirQParams.toString())
    }
}