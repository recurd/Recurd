export default class Artist {
    #sql

    constructor(sql) {
        this.#sql = sql
    }

    async get(id) {
        const [result] = await this.#sql`
                SELECT
                    *
                FROM
                    artists a
                WHERE
                    a.id = ${id}`
        return result
    }

    async getAlbums(id, limit) {
        const result = await this.#sql`
                SELECT
                    al.*,
                    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ar.id, 'name', ar.name)) as other_artists
                FROM
                    artist_albums aa1
                JOIN
                    albums al ON aa1.album_id = al.id
                JOIN
                    artist_albums aa2 ON al.id = aa2.album_id
                JOIN
                    artists ar ON aa2.artist_id = ar.id
                WHERE
                    aa1.artist_id = ${id} 
                    AND ar.id <> ${id}
                GROUP BY
                    al.id
                ORDER BY
                    al.name DESC
                ${ limit > 0 ? 
                    this.#sql`LIMIT ${limit}` : this.#sql``}`
        return result
    }

    async getSongs(id, limit) {
        const result = await this.#sql`
                SELECT DISTINCT ON (s.id)
                    s.*,
                    JSONB_BUILD_OBJECT('id', al.id, 'image', al.image) as album
                FROM
                    artist_songs ass
                JOIN
                    songs s ON ass.song_id = s.id
                JOIN
                    album_songs als ON s.id = als.song_id
                JOIN
                    albums al ON als.album_id = al.id
                WHERE
                    ass.artist_id = ${id}
                GROUP BY
                    s.id, al.id
                ORDER BY
                    s.id, al.name DESC
                ${ limit > 0 ? 
                    this.#sql`LIMIT ${limit}` : this.#sql``}`
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
                artist_songs ars ON l.song_id = ars.song_id
            JOIN
                users u ON l.user_id = u.id
            WHERE 
                ars.artist_id = ${id}
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
            JOIN 
                artist_songs ars ON l.song_id = ars.song_id
            WHERE 
                ars.artist_id = ${id}
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
                artists
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