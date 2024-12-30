export default class Song {
    #sql

    constructor(sql) {
        this.#sql = sql
    }


    async get(id) {
        return await this.#sql`
            SELECT * 
            FROM    songs s
            WHERE   s.id = ${id}`
    }

    async getAlbums(id) {
        const result = await this.#sql`
            SELECT a.*
            FROM albums a
            JOIN album_songs abs ON a.id = abs.album_id
            WHERE abs.song_id = ${id}
            ORDER BY a.release_date DESC
        `
        return result
    }

    async getRatings(id) {
        const result = await this.#sql`
            SELECT
                rating AS rating,
                COUNT(rating)::integer AS count
            FROM
                song_opinions
            WHERE
                song_id = ${id}
                AND rating IS NOT NULL
            GROUP BY
                rating
            ORDER BY
                rating ASC
        `
        return result
    }

    async getReviews(id) {
        const result = await this.#sql`
            SELECT
                so.user_id,
                so.time_stamp,
                so.rating,
                so.review
            FROM
                song_opinions so
            WHERE
                so.song_id = ${id}
                AND so.review IS NOT NULL
            ORDER BY
                so.time_stamp DESC
        `
        return result
    }

    async getTopListeners({ id, start_date, end_date, n }) {
        const result = await this.#sql`
            SELECT
                l.user_id as id,
                u.display_name as display_name,
                u.image as image,
                COUNT(l.id) AS listen_count
            FROM 
                listens l
            JOIN
                users u ON l.user_id = u.id
            WHERE 
                l.song_id = ${id}
                AND l.time_stamp 
                    ${start_date ? 
                        this.#sql`BETWEEN ${start_date} AND ${end_date}` : 
                        this.#sql`<= ${end_date}`}
            GROUP BY 
                l.user_id, u.id
            ORDER BY 
                listen_count DESC
            ${n ? this.#sql`LIMIT ${n}` : this.#sql``}`
        return result
    }

    async getActivity({ id, unit, start_date, end_date }) {
        // unit accepts: minute, hour, day, week, month, quarter, year
        const result = await this.#sql`
            SELECT
                COUNT(*) AS listen_count,
                date_trunc(${unit}, l.time_stamp) as unit_value
            FROM 
                listens l
            WHERE 
                l.song_id = ${id}
                AND l.time_stamp 
                    ${start_date ? 
                        this.#sql`BETWEEN ${start_date} AND ${end_date}` : 
                        this.#sql`<= ${end_date}`}
            GROUP BY 
                unit_value
            ORDER BY 
                unit_value ASC`
        return result
    }
    
    async searchByName(query) {
        if (!query || query.trim() === '') {
            return []
        }
    
        const result = await this.#sql`
            SELECT
                name, id
            FROM
                songs
            WHERE
                name ILIKE '%' || ${query} || '%'
            ORDER BY
                CASE
                    WHEN name ILIKE ${query + '%'} THEN 1
                    WHEN name ILIKE '%' || ${query} || '%' THEN 2
                    ELSE 3
                END,
                name ASC
            LIMIT 10
        `
        return result.map(row => ({ name: row.name, id: row.id }))
    }    
    
}