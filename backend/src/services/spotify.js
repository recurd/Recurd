// TODO: better design pattern for these, possibly in singleton class

const SPOTIFY_API_URL_BASE = "https://api.spotify.com/v1"

export async function initAccessToken(auth_code, redirect_uri) {
    const response = await fetch('https://accounts.spotify.com/api/token',  {
        method: 'POST',
        body: new URLSearchParams({ // for urlencoded body
            code: auth_code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer
                .from(process.env.SPOTIFY_CLIENT_ID + ':' + 
                    process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
        }
    })
    if (!response.ok) {
        const error = await result.json()
        return { success: false, result: error.error_description }
    }
    const body = await response.json()
    return { success: true, result: body }
}

export async function refreshAccessToken(refresh_token) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer
                        .from(process.env.SPOTIFY_CLIENT_ID + ':' + 
                              process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        }),
    })
    if (!response.ok) {
        const error = await result.json()
        return { success: false, result: error.error_description }
    }
    const body = await response.json()
    // const { access_token, expires_in } = body
    // const new_refresh_token = body.refresh_token ?? refresh_token // new refresh token not guaranteed
    // const expires_at = new Date(Date.now()+expires_in * 1000)
    return { success: true, result: body }
}

export async function fetchCurrListeningTrack(access_token) {
    const response = await fetch(SPOTIFY_API_URL_BASE+"/me/player/currently-playing", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })

    if (!response.ok) {
        if (response.status == 401) {
            // Retry with refresh_token
            return { success: false, retry: true }
        }
        const error = await response.json()
        return { success: false, result: error.message }
    }

    const body = await response.json()
    // If the user is in private session, or is not listening to a track (ads, podcast or unknown)
    // do not return the currently listening track
    if (body?.device?.is_private_session || body?.currently_playing_type !== 'track') {
        return { success: true, result: null }
    }

    return { success: true, result: body.item }
}

// fetch_after is a Date object that is the timestamp where we should fetch recent listens after
export async function fetchRecentListens(last_fetch_timestamp) {
    const qparams = new URLSearchParams({
        limit: 50,
        after: last_fetch_timestamp.getTime()
    })
    const url = SPOTIFY_API_URL_BASE + "/me/player/recently-played" 
            + (qparams ? '?'+qparams.toString() : '')
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })

    if (!response.ok) {
        if (response.status == 401) {
            // Retry with refresh_token
            return { success: false, retry: true }
        }
        const error = await response.json()
        return { success: false, result: error.message }
    }

    const body = await response.json()
    return { success: true, result: body.items }
}