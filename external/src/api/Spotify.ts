// Http requests for the Spotify Web API

import dotenv from 'dotenv' // env file in backend (!?)
import { APIError, FetchError, RefreshError } from './Types.js'
import {
    TokenResponse,
    CurrentlyPlayingTrackResponse,
    RecentlyPlayedTracksResponse
} from './SpotifyTypes.js'
dotenv.config()

const SPOTIFY_API_URL_TOKEN = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_URL_BASE = 'https://api.spotify.com/v1'

// Get access token for user (initial process)
export async function initAccessToken(authCode: string, redirectUri: string) : Promise<TokenResponse> {
    const response = await fetch(SPOTIFY_API_URL_TOKEN,  {
        method: 'POST',
        body: new URLSearchParams({ // for urlencoded body
            code: authCode,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer
                .from(process.env.SPOTIFY_CLIENT_ID + ':' + 
                    process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
        }
    })
    if (!response.ok) {
        const error = await response.json()
       throw new APIError(error.error_description)
    }

    return (await parseResponseJSON(response) as TokenResponse)
}

// Request an access token using the refresh token
export async function refreshAccessToken(refreshToken: string) : Promise<TokenResponse> {
    const response = await fetch(SPOTIFY_API_URL_TOKEN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer
                        .from(process.env.SPOTIFY_CLIENT_ID + ':' + 
                              process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }),
    })
    if (!response.ok) {
        const error = await response.json()
        throw new APIError(error.error_description)
    }
    return (await parseResponseJSON<TokenResponse>(response))
}

export async function fetchCurrentlyPlayingTrack(accessToken: string) : Promise<CurrentlyPlayingTrackResponse | null> {
    const response = await fetch(SPOTIFY_API_URL_BASE+"/me/player/currently-playing", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })

    if (!response.ok) {
        if (response.status == 401) {
            // Retry with refresh_token
            throw new RefreshError(response)
        }
        throw new FetchError(response, 'Refreshing token failed')
    }

    // Not currently playing anything
    if (response.status == 204) {
        return null
    }
    // Currently playing (might be paused)

    return (await parseResponseJSON<CurrentlyPlayingTrackResponse>(response))
}

// last_fetch_timestamp (optional) is the timestamp where we should fetch recent listens after
export async function fetchRecentlyPlayedTracks(accessToken: string, lastFetchTimestamp: Date | undefined) : Promise<RecentlyPlayedTracksResponse | null> {
    const qparams = new URLSearchParams({
        limit: '50' // this is the maximum limit
    })
    if (lastFetchTimestamp) 
        qparams.set('after', lastFetchTimestamp.getTime().toString())

    const url = SPOTIFY_API_URL_BASE + "/me/player/recently-played" 
            + (qparams ? '?'+qparams.toString() : '')
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })

    if (!response.ok) {
        if (response.status == 401) {
            // Retry with refresh_token
            throw new RefreshError(response)
        }
        throw new FetchError(response, 'Refreshing token failed')
    }

    // Possibly no recently played track? (not sure)
    if (response.status == 204) {
        return null
    }

    return (await parseResponseJSON<RecentlyPlayedTracksResponse>(response))
}

async function parseResponseJSON<T>(response: Response) : Promise<T> {
    const body = await response.text()
    try {
        const jsonValue: T = JSON.parse(body)
        return jsonValue
    } catch (e) {
        throw new FetchError(response)
    }
}