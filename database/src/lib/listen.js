import sql from '../db.js'
import { findOrInsertSongArtistAlbum } from './metadata.js'
import { removeNullish } from '../util.js'

export async function insertListenById({ user_id, song_id, time_stamp }) {
    const insert_listen = { user_id, song_id, time_stamp }
    removeNullish(insert_listen)
    const [res] = await sql`
        INSERT INTO listens ${sql(insert_listen)}
        RETURNING id as listen_id, time_stamp`
    return res
}

export async function insertListen({ user_id, time_stamp, song, songArtists, album, albumArtists }) {
    const result = await sql.begin(async sql => {
        const { song: outSong, album: outAlbum } = await findOrInsertSongArtistAlbum({
            song,
            songArtists,
            album,
            albumArtists
        }, sql)

        // Insert listen
        const { listen_id, time_stamp: res_timestamp } = await insertListenById({ user_id, song_id: outSong.id, time_stamp }, sql)
        return {
            listen_id,
            song: outSong,
            artists: song.artists,
            album: outAlbum,
            time_stamp: res_timestamp
        }
    })
    return result
}