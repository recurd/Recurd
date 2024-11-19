// Types of input from Spotify Web API

export interface TokenResponse {
    access_token: string
    refresh_token: string // Note: spotify might not provide refresh token if access token has not expired
    expires_in: number
}

export interface CurrentlyPlayingTrackResponse {
    item: Track
    progress_ms: number
    device?: {
        is_private_session: boolean
    },
    currently_playing_type?: 'track' | 'episode' | 'unknown',
    is_playing?: boolean
}

export interface RecentlyPlayedTracksResponse {
    cursors? : {
        after: string,
        before: string
    },
    items?: PlayHistoryObject[]
}

// Corresponds to SimplifiedArtist object in Spotify's Web API
// Note that this is distinct from Artist object
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

export interface PlayHistoryObject {
    track: Track
    played_at: string, // ISO datestring
    context?: {
        type?: 'artist' | 'playlist' | 'album' | 'show'
    }
}