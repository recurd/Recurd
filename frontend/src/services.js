import { redirect } from 'react-router-dom'
import backend from './backend.js'

export async function isServiceConnected(status_type) {
  try {
    console.log(status_type)
    const res = await backend.get('/service/'+status_type+'/status')
    console.log(res.data)
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

export const servicesCallbackPath = {
  SPOTIFY: "/service/spotify-callback"
}

export async function spotifyRedirLoader({ request }) {
    const url = new URL(request.url)
    const redirect_uri = url.origin + url.pathname // no search params
    const auth_code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    console.log(redirect_uri)

    const errorParams = new URLSearchParams({
        success: false, 
        service_type: "spotify", 
        message: null
    })

    if (error) {
        errorParams.set('message', error)
        return redirect('/settings?'+errorParams.toString()) // return value to page, which can be accessed by useLoaderData hook
    } else {
        try {
            await backend.post('/service/spotify/auth', {
                auth_code,
                redirect_uri
            })
            return redirect('/settings') // Connect spotify button is in settings
            // NOTE: It is impossible to store dynamically where we should redirect to because 
            // a new instance of react is created when spotify redirects back
            // Also, we cannot change the redirect_uri provided to spotify as it as to be static, otherwise access is denied
        } catch (e) {
          // Grab server's error message
          if (e.serverResponds) {
            errorParams.set('message', e.response.data.error.error_description)
            return redirect('/settings?'+errorParams.toString())
          } else {
            errorParams.set('message', e.response.statusText)
            return redirect('/settings?'+errorParams.toString())
          }
        }
    }
}