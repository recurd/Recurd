// Types and Http requests for the Spotify Web API
import dotenv from 'dotenv' // env file in backend (!?)
import { APIResult } from './Types.js'
dotenv.config()

const SPOTIFY_API_URL_TOKEN = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_URL_BASE = 'https://api.spotify.com/v1'

// Types of input from Spotify Web API
export interface TokenResponse {
    access_token: string,
    refresh_token: string,
    expires_in: number
}

// Corresponds to SimplifiedArtist object in Spotify's Web API
export interface SmplArtist {
    id: string,
    name: string // and more
}

export interface Album {
    id: string,
    name: string,
    album_type: 'album' | 'single' | 'compilation' | undefined,
    total_tracks: number | undefined,
    images: {
        url: string,
        height: number,
        weight: number
    }[] | undefined,
    release_date: string | undefined,
    release_date_precision: 'year' | 'month' | 'day' | undefined,
    artists: SmplArtist[]
}

export interface Track { // Spotify doesn't have songs, just tracks
    id: string,
    name: string,
    disc_number: number | undefined,
    track_number: number | undefined,
    duration_ms: number | undefined, // milliseconds
    artists: SmplArtist[],
    album: Album,
    // is_local: boolean,
    // explicit: boolean,
    // external_ids: {
    //     isrc: string // International Standard Recording Code
    // },
    // popularity: number
}

// Get access token for user (initial process)
export async function initAccessToken(authCode: string, redirectUri: string) : Promise<APIResult> {
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
        return { success: false, result: error.error_description }
    }
    const body = await response.json()
    return { success: true, result: body }
}

// Request an access token using the refresh token
export async function refreshAccessToken(refreshToken: string) : Promise<APIResult> {
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
        return { success: false, result: error.error_description }
    }
    const body = await response.json()
    // const { access_token, expires_in } = body
    // const new_refresh_token = body.refresh_token ?? refresh_token // new refresh token not guaranteed
    // const expires_at = new Date(Date.now()+expires_in * 1000)
    return { success: true, result: body }
}

export async function fetchCurrentlyPlayingTrack(accessToken: string) : Promise<APIResult> {
    const response = await fetch(SPOTIFY_API_URL_BASE+"/me/player/currently-playing", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })

    if (!response.ok) {
        if (response.status == 401) {
            // Retry with refresh_token
            return { success: false, retry: true, result: null }
        }
        const error = await response.json()
        return { success: false, result: error.message }
    }

    // Not currently playing anything
    if (response.status == 204) {
        return { success: true, result: null }
    }
    // Currently playing (might be paused)
    const body = await response.json()
    console.log(body)
    return { success: true, result: body }
}

// last_fetch_timestamp (optional) is a Date object that is the timestamp where we should fetch recent listens after
export async function fetchRecentlyPlayedTracks(accessToken: string, lastFetchTimestamp: Date | undefined) : Promise<APIResult> {
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
            return { success: false, retry: true, result: null }
        }
        const error = await response.json()
        return { success: false, result: error.message }
    }

    // Possibly no recently played track? (not sure)
    if (response.status == 204) {
        return { success: true, result: null }
    }
    const body = await response.json()
    return { success: true, result: body.items }
}