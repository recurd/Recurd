import { removeNullish } from "../util.js"

export default class Opinion {
    #sql

    constructor(sql) {
        this.#sql = sql
    }

    async insertSongOpinion({ user_id, song_id, time_stamp, rating, review }) {
        const songOpinion = { user_id, song_id, time_stamp, rating, review }
        return await this.#sql`
            INSERT INTO song_opinions ${this.#sql(removeNullish(songOpinion))}
            RETURNING *` // i.e. if recieved null for timestamp, remove it from object
    }

    async insertAlbumOpinion({ user_id, album_id, time_stamp, rating, review }) {
        const albumOpinion = { user_id, album_id, time_stamp, rating, review }
        return await this.#sql`
            INSERT INTO album_opinions ${this.#sql(removeNullish(albumOpinion))}
            RETURNIN *
        `
    }

}