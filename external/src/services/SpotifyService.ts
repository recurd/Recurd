import {
    insertUserService,
    getUserService
} from 'recurd-database/userService'
import {
    findOrInsertSongArtistAlbum
} from 'recurd-database/metadata'
import {
    insertListen
} from 'recurd-database/listen'
import * as Spotify from '../api/Spotify.js'
import { Service, ServiceFactory, ServiceType } from './Types.js'
import Formatter from '../formatter/SpotifyFormatter.js'

export class SpotifyServiceFactory implements ServiceFactory<SpotifyService> {

    async fromExternal(user_id: string, payload: { auth_code: string, redirect_uri: string }) {
        const result = await Spotify.initAccessToken(payload.auth_code, payload.redirect_uri)

        if (!result.success) {
            throw new Error(result.result)
        }

        const { access_token, refresh_token, expires_at	} = Formatter.formatTokens(result.result)

        const success = await insertUserService({
            user_id,
            service_type : ServiceType.SPOTIFY,
            access_token : access_token,
            refresh_token: refresh_token,
            expires_at: expires_at
        })
        if (!success) {
            throw new Error(`Failed to insert user ${user_id}'s service (${ServiceType.SPOTIFY}) into database`)
        }
        return new SpotifyService(user_id, access_token, refresh_token)
    }

    async fromDatabase(user_id: string) {
        const service = await getUserService(user_id, ServiceType.SPOTIFY)
        if (!service) {
            // User ${user_id} not connected to this service of type: ${ServiceType.SPOTIFY}
            return undefined
        }
        return new SpotifyService(user_id, service.access_token, service.refresh_token)
    }
}

export class SpotifyService implements Service {
    user_id: string
    #access_token: string
    #refresh_token: string

    constructor(user_id: string, access_token: string, refresh_token: string) {
        this.user_id = user_id
        this.#access_token = access_token
        this.#refresh_token = refresh_token
    }

    async refreshToken() {
        const spRes = await Spotify.refreshAccessToken(this.#refresh_token)
        if (!spRes.success) {
            throw new Error(`Unable to refresh the access token for user ${this.user_id} with service ${ServiceType.SPOTIFY}`)
        }

        const { access_token, refresh_token, expires_at } = Formatter.formatTokens(spRes.result)
        // Special case: refresh_token may be null here 
        // if we accidentally request a refresh but access token hasn't expired
        // Not sure how it happens but sometimes Spotify sends back 401 unauthorized which triggers this refresh
        const dbRes = await insertUserService({
            user_id: this.user_id,
            service_type : ServiceType.SPOTIFY,
            access_token : access_token,
            refresh_token: refresh_token ?? this.#refresh_token,
            expires_at: expires_at
        })
        if (!dbRes) {
            throw new Error(`Failed to insert user ${this.user_id}'s service (${ServiceType.SPOTIFY}) into database on refreshing token`)
        }
        this.#access_token = access_token
        this.#refresh_token = refresh_token ?? this.#refresh_token
    }

    async getCurrentlyListening() : Promise<{ track: any, is_paused?: boolean }> {
        let res = await Spotify.fetchCurrentlyPlayingTrack(this.#access_token)
        if (!res.success && res.retry) {
            this.refreshToken() // would throw
            res = await Spotify.fetchCurrentlyPlayingTrack(this.#access_token)
        }
        else if (!res.success) {
            throw new Error(res.result)
        }

        // If the user is in private session, or is not listening to a track (ads, podcast or unknown)
        // do not return the currently listening track
        const spRes = res.result
        if (spRes?.device?.is_private_session || spRes?.currently_playing_type !== 'track') {
            return { track: null }
        }
        if (!spRes) {
            return { track: null }
        }

        // Format spotify API returned result to be in our DB format
        const songNMtdt = Formatter.formatTrackToMetadatas(spRes.item)
        const { song: retSong, album: _ } = await findOrInsertSongArtistAlbum(songNMtdt)
        return { track: retSong, is_paused: !spRes.is_playing }
    }

    async getRecentListens(last_fetch_timestamp: Date | undefined) : Promise<{ listens: any[] }> {
        let res = await Spotify.fetchRecentlyPlayedTracks(this.#access_token, last_fetch_timestamp)
        if (!res.success && res.retry) {
            this.refreshToken() // would throw
            res = await Spotify.fetchRecentlyPlayedTracks(this.#access_token, last_fetch_timestamp)
        }
        else if (!res.success) {
            throw new Error(res.result)
        }

        const spRes = res.result
        if (!spRes) {
            return { listens: [] }
        }

        const listens: any[] = []
        for (const track of spRes) {
            const songNMtdt = Formatter.formatRecentlyPlayedTrack(track)
            const listen = await insertListen({
                user_id: this.user_id,
                ...songNMtdt
            })
            listens.push(listen)
        }
        return {
            listens: listens
        }
    }
}