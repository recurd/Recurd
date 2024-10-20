// Handles conversion between Spotify's Web API and our database acceptable inputs

import * as Spotify from '../api/Spotify.js'
function formatTokens(tokens: Spotify.TokenResponse) {
    return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000)
            // add to current epoch time (milliseconds)
            // expires_in is in seconds
    }
}

export function formatSmplArtist(artist: Spotify.SmplArtist) {
    return {
        name: artist.name
    }
}

function parseReleaseDate(datestring: string) : Date {
    const parts = datestring.split('-')
    return new Date(Date.UTC(
        parseInt(parts.at(0) ?? '0'), // year
        parseInt(parts.at(1) ?? '1'), // month
        parseInt(parts.at(2) ?? '1'), // day
    ))
}

export function formatAlbum(album: Spotify.Album) {
    return {
        name: album.name,
        artists: album.artists.map(e=>formatSmplArtist(e)),
        album_type: (album.album_type === 'single' ? album.album_type : 'album'),
        release_date: (album.release_date && album.release_date_precision) 
            ? parseReleaseDate(album.release_date)
            : undefined,
        image: album?.images?.at(0)?.url
    }
}

function formatTrack(track: Spotify.Track) {
    return {
        song: {
            name: track.name,
            // duration: track.duration_ms
            artists: track.artists.map(e => formatSmplArtist(e)),
            album: formatAlbum(track.album)
        },
        trackInfo: {
            disc_number: track.disc_number,
            album_position: track.track_number
        }
    }
}

function formatTrackToMetadatas(track: Spotify.Track) {
    const { song, trackInfo } = formatTrack(track)
    // Extract fields from song for insertion
    const procSong: any = song // cast to any to delete properties that we can't allow when inserting into DB
    const songArtists = procSong.artists
    delete procSong.artists
    const album = procSong.album
    delete procSong.album
    const albumArtists = album.artists
    delete album.artists
    return {
        song: procSong,
        trackInfo: trackInfo,
        songArtists: songArtists,
        album: album,
        albumArtists: albumArtists
    }
}

interface Listen {
    track: Spotify.Track
    played_at: string, // ISO datestring
    // context: {}
}

function formatRecentlyPlayedTrack(listen: Listen) {
    const time_stamp = new Date(listen.played_at)
    return {
        time_stamp,
        ...formatTrackToMetadatas(listen.track)
    }
}

export default {
    formatTokens,
    formatSmplArtist, 
    formatAlbum,
    formatTrack,
    formatTrackToMetadatas,
    formatRecentlyPlayedTrack
}