import Database from '../db.js'
import * as Spotify from '../api/Spotify.js'
import { Service, ServiceFactory, ServiceType } from './Types.js'
import Formatter from '../formatter/SpotifyFormatter.js'
import { RefreshError } from '../api/Types.js'
import { CurrentlyPlayingTrackResponse, RecentlyPlayedTracksResponse } from '../api/SpotifyTypes.js'

export class SpotifyServiceFactory implements ServiceFactory<SpotifyService> {

    async fromExternal(user_id: string, payload: { auth_code: string, redirect_uri: string }) {
        const tokenRes = await Spotify.initAccessToken(payload.auth_code, payload.redirect_uri)

        const { access_token, refresh_token, expires_at	} = Formatter.formatTokens(tokenRes)

        const success = await Database.UserService.insert({
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
        const service = await Database.UserService.get(user_id, ServiceType.SPOTIFY)
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

    async refreshToken() : Promise<void> {
        const tokenRes = await Spotify.refreshAccessToken(this.#refresh_token)
        const { access_token, refresh_token, expires_at } = Formatter.formatTokens(tokenRes)
        // Special case: refresh_token may be null here 
        // if we accidentally request a refresh but access token hasn't expired
        // Not sure how it happens but sometimes Spotify sends back 401 unauthorized which triggers this refresh
        const dbRes = await Database.UserService.insert({
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

    async getCurrentlyListening() : Promise<{ track: any, is_paused?: boolean, progress?: number, duration?: number }> {
        let spRes: CurrentlyPlayingTrackResponse | null 
        try {
             spRes = await Spotify.fetchCurrentlyPlayingTrack(this.#access_token)
        } catch (e) {
            if (e instanceof RefreshError) {
                this.refreshToken() // would throw
                spRes = await Spotify.fetchCurrentlyPlayingTrack(this.#access_token)
            } else {
                throw e
            }
        }

        if (!spRes) {
            return { track: null }
        }

        // If the user is in private session, or is not listening to a track (ads, podcast or unknown)
        // do not return the currently listening track
        if (spRes?.device?.is_private_session || spRes?.currently_playing_type !== 'track') {
            return { track: null }
        }

        // Format spotify API returned result to be in our DB format
        const songNMtdt = Formatter.formatTrackToMetadatas(spRes.item)
        const { song: retSong, album: retAlbum } = await Database.Metadata.findOrInsertSongArtistAlbum(songNMtdt)

        // Get the progress and total duration (ms) of the song, then calculate time-to-end
        const progress = spRes.progress_ms
        const duration = spRes.item.duration_ms
        return {
            track: { ...retSong, album: retAlbum },
            is_paused: !spRes.is_playing,
            progress: progress,
            duration: duration
        }
    }

    async getRecentListens() : Promise<any[]> {
        const user_service = await Database.UserService.get(this.user_id, ServiceType.SPOTIFY)
        if (!user_service) {
            throw new Error("User service not found when getting recent listens!")
        }
        const last_fetch_timestamp = user_service.last_updated

        let res: RecentlyPlayedTracksResponse | null
        try {
            res = await Spotify.fetchRecentlyPlayedTracks(this.#access_token, last_fetch_timestamp)
        } catch (e) {
            if (e instanceof RefreshError) {
                this.refreshToken() // would throw
                res = await Spotify.fetchRecentlyPlayedTracks(this.#access_token, last_fetch_timestamp)
            } else {
                throw e
            }
        }

        // cache current time for later
        const now = Date.now()

        // For each listen, format it and insert it into database
        const listens: any[] = []
        if (res?.items) { // res cab be nullish if no songs are returned
            for (const track of res.items) {
                const songNMtdt = Formatter.formatPlayHistoryObject(track)
                const listen = await Database.Listen.insertByData({
                    user_id: this.user_id,
                    ...songNMtdt
                })
                listens.push(listen)
            }
        }

        // New fetch timestamp will be the time that the user finishes the last song 
        // (according to Spotify) or current time (if Spotify didn't provide the info)
        const spotify_new_fetch_tstp = res?.cursors?.after ? parseInt(res.cursors.after) : undefined
        const new_fetch_timestamp = new Date(spotify_new_fetch_tstp ?? now)

        // No await here as we don't need to wait for this to return
        Database.UserService.setLastUpdated(this.user_id, ServiceType.SPOTIFY, new_fetch_timestamp)
        return listens
    }
}