import { removeNullish } from '../util.js'

export default class Listen {
    #sql
    #metadata // the exported object of this library, which contains other DB components

    constructor(sql, metadata) {
        this.#sql = sql
        this.#metadata = metadata
    }

    // Internal function, with transaction context
    async #insertByIdTxact({ user_id, song_id, time_stamp }, sqlTxact) {
        const insert_listen = { user_id, song_id, time_stamp }
        removeNullish(insert_listen)
        const [res] = await sqlTxact`
            INSERT INTO listens ${sqlTxact(insert_listen)}
            RETURNING id as listen_id, time_stamp`
        return res
    }

    async insertById({ user_id, song_id, time_stamp }) {
        return this.#insertByIdTxact({ user_id, song_id, time_stamp }, this.#sql)
    }

    async insertByData({ user_id, time_stamp, song, trackInfo, songArtists, album, albumArtists }) {
        const result = await this.#sql.begin(async sqlTxact => {
            const { song: outSong, album: outAlbum } = await this.#metadata.findOrInsertSongArtistAlbum({
                    song,
                    trackInfo,
                    songArtists,
                    album,
                    albumArtists
            }, sqlTxact)

            // Insert listen
            const { listen_id, time_stamp: res_timestamp } = await this.#insertByIdTxact({ 
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
}