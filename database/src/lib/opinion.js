import { removeNullish } from "../util.js"

export default class Opinion {
    #sql

    constructor(sql) {
        this.#sql = sql
    }

    async getSongOpinion(id)  {
        return await this.#sql`
            SELECT *
            FROM    song_opinions s
            WHERE   id = ${id}`
    }

    async getAlbumOpinion(id)  {
        return await this.#sql`
            SELECT *
            FROM    album_opinions a
            WHERE   id = ${id}`
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
            RETURNING *`
    }

    async updateSongOpinion({ user_id, opinion_id, time_stamp, rating, review }) {
        const songOpinion = { time_stamp, rating, review }
        return await this.#sql`
            UPDATE song_opinions
            SET ${this.#sql(removeNullish(songOpinion))}
            WHERE id = ${opinion_id} AND user_id = ${user_id}
            RETURNING *`
    }

    async updateAlbumOpinion({ user_id, opinion_id, time_stamp, rating, review }) {
        const albumOpinion = { time_stamp, rating, review }
        return await this.#sql`
            UPDATE album_opinions
            SET ${this.#sql(removeNullish(albumOpinion))}
            WHERE id = ${opinion_id} AND user_id = ${user_id}
            RETURNING *`
    }

    async deleteSongOpinion({ user_id, opinion_id }) {
        return await this.#sql`
            DELETE FROM song_opinions
            WHERE id = ${opinion_id} AND user_id = ${user_id}`
    }

    async deleteAlbumOpinion({ user_id, opinion_id }) {
        return await this.#sql`
            DELETE FROM album_opinions
            WHERE id = ${opinion_id} AND user_id = ${user_id}`
    }

}