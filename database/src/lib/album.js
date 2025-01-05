export default class Album {
    #sql

    constructor(sql) {
        this.#sql = sql
    }

    async get(id) {
        const [result] = await this.#sql`
            SELECT
                a.*,
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ar.id, 'name', ar.name)) as artists
            FROM
                albums a
            JOIN
                artist_albums aas ON a.id = aas.album_id
            JOIN
                artists ar ON aas.artist_id = ar.id
            WHERE
                a.id = ${id}
            GROUP BY
                a.id`
        return result
    }

    // Tracks differ from songs in that tracks contain info of their location in an album
    async getTracks(id) {
        const result = await this.#sql`
            SELECT
                s.*,
                abs.disc_number AS disc_number,
                abs.album_position AS album_position,
                COALESCE(AVG(so.rating)::numeric(10, 2), 0) AS average_rating,
                COUNT(so.rating)::integer AS rating_count
            FROM
                album_songs abs
            JOIN
                songs s ON abs.song_id = s.id
            LEFT JOIN
                song_opinions so ON so.song_id = s.id
            WHERE
                abs.album_id = ${id}
            GROUP BY
                s.id, abs.disc_number, abs.album_position
            ORDER BY
                abs.disc_number ASC NULLS LAST,
                abs.album_position ASC NULLS LAST,
                s.name DESC
        `
        return result
    }    

    // Return an array of { rating: int, count: int }. Note that if a rating is 0, no corresponding object will be returned
    async getRatings(id) {
        const result = await this.#sql`
            SELECT
                rating AS rating,
                COUNT(rating)::integer AS count
            FROM
                album_opinions
            WHERE
                album_id = ${id}
                AND rating IS NOT NULL
            GROUP BY
                rating
            ORDER BY
                rating ASC`
        return result
    }

    async getAvgRating(id) {
        const [result] = await this.#sql`
            SELECT
                AVG(rating) AS average
            FROM
                album_opinions
            WHERE
                album_id = ${id}
                AND rating IS NOT NULL`
        return result
    }

    async getReviews(id) {
        const result = await this.#sql`
            SELECT
                ao.user_id,
                ao.time_stamp,
                ao.rating,
                ao.review
            FROM
                album_opinions ao
            WHERE
                ao.album_id = ${id}
                AND ao.review IS NOT NULL
            ORDER BY
                ao.time_stamp DESC`
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
                album_songs abs ON l.song_id = abs.song_id
            JOIN
                users u ON l.user_id = u.id
            WHERE 
                abs.album_id = ${id}
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

    async searchByName(query) {
        if (!query || query.trim() === '') {
            return []
        }
    
        const result = await this.#sql`
            SELECT
                name, id
            FROM
                albums
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

// Old version of album ratings, where we always return an array of { rating: int, count: int }
// and used SQL to fill in ratings with count of 0. This should not be done on the backend because it is unnecessarily costly.
// const result = await sql`
//         WITH def AS (
//             SELECT 
//                 n as rating,
//                 0::integer as count
//             FROM
//                 generate_series(1,10) n
//         ), res AS (
//             SELECT
//                 aos.rating as rating,
//                 COUNT(aos.rating)::integer as count
//             FROM
//                 album_opinions aos
//             WHERE
//                 aos.album_id = ${id}
//                 AND aos.rating IS NOT NULL
//             GROUP BY
//                 aos.rating
//         )
//         SELECT * FROM res
//         UNION ALL
//         SELECT * FROM def
//         WHERE NOT EXISTS (
//             SELECT * FROM res WHERE res.rating = def.rating
//         )
//         ORDER BY
//             rating ASC`