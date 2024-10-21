import sqlDf from '../db.js'
import { findOrInsertSongArtistAlbum } from './metadata.js'
import { removeNullish } from '../util.js'

// Internal function, with transaction context
async function insertListenByIdTxact({ user_id, song_id, time_stamp }, sql=sqlDf) {
    const insert_listen = { user_id, song_id, time_stamp }
    removeNullish(insert_listen)
    const [res] = await sql`
        INSERT INTO listens ${sql(insert_listen)}
        RETURNING id as listen_id, time_stamp`
    return res
}

export async function insertListenById({ user_id, song_id, time_stamp }) {
    return insertListenByIdTxact({ user_id, song_id, time_stamp }, sqlDf)
}

export async function insertListen({ user_id, time_stamp, song, trackInfo, songArtists, album, albumArtists }) {
    const result = await sqlDf.begin(async sqlTxact => {
        const { song: outSong, album: outAlbum } = await findOrInsertSongArtistAlbum({
                song,
                trackInfo,
                songArtists,
                album,
                albumArtists
        }, sqlTxact)

        // Insert listen
        const { listen_id, time_stamp: res_timestamp } = await insertListenByIdTxact({ 
                user_id,
                song_id: outSong.id,
                time_stamp
        }, sqlTxact)
        return {
            listen_id,
            track: outSong,
            album: outAlbum,
            time_stamp: res_timestamp
        }
    })
    return result
}