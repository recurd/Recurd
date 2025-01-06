export default class User {
    #sql

    constructor(sql) {
        this.#sql = sql
    }

    async getProfile(user_id) {
        const [user] = await this.#sql`
            SELECT 
                u.id,
                u.username,
                u.display_name,
                u.image,
                u.stats,
                (SELECT COUNT(follower) FROM user_followers WHERE followee = u.id) as follower_count,
                (SELECT COUNT(followee) FROM user_followers WHERE follower = u.id) as following_count
            FROM users u
            WHERE u.id = ${user_id}
        `

        return user
    }

    async getByUsername(username) {
        const [user] = await this.#sql`SELECT * FROM users WHERE username = ${username}`
        return user
    }

    async getServices(user_id) {
        const [result] = await this.#sql`
            SELECT
                ARRAY_AGG(ut.service_type) as services
            FROM
                users u
            JOIN
                user_services us ON u.id = us.user_id
            JOIN
                user_services_t ut ON us.service_id = ut.id
            WHERE
                u.id = ${user_id}
            GROUP BY
                u.id`
        return result ? result.services : []
    }

    async insert({ username, password, display_name }) {
        return await this.#sql`INSERT INTO USERS ${this.#sql({ username, password, display_name })}`
    }

    async getTopArtists({ user_id, start_date, end_date, n }) {
        const topArtists = await this.#sql`
            SELECT
                ar.*,
                COUNT(DISTINCT l.id) AS listen_count
            FROM
                listens l
            JOIN
                artist_songs ars ON l.song_id = ars.song_id
            JOIN
                artists ar ON ars.artist_id = ar.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp 
                    ${start_date ? 
                        this.#sql`BETWEEN ${start_date} AND ${end_date}` : 
                        this.#sql`<= ${end_date}`}
            GROUP BY
                ar.id
            ORDER BY
                listen_count DESC
            ${n ? this.#sql`LIMIT ${n}` : this.#sql``}`
        return topArtists
    }

    async getTopAlbums({ user_id, start_date, end_date, n }) {
        const topAlbums = await this.#sql`
            SELECT
                a.*,
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ar.id, 'name', ar.name)) as artists,
                COUNT(DISTINCT l.id) AS listen_count
            FROM
                listens l
            JOIN
                album_songs als ON l.song_id = als.song_id
            JOIN
                albums a ON als.album_id = a.id
            JOIN
                artist_albums abs ON a.id = abs.album_id
            JOIN
                artists ar ON abs.artist_id = ar.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp 
                    ${start_date ? 
                        this.#sql`BETWEEN ${start_date} AND ${end_date}` : 
                        this.#sql`<= ${end_date}`}
            GROUP BY
                a.id
            ORDER BY
                listen_count DESC
            ${n ? this.#sql`LIMIT ${n}` : this.#sql``}`
        return topAlbums
    }

    async getTopSongs({ user_id, start_date, end_date, n }) {
        // When a song is linked to multiple albums, some albums will have to be ignored 
        // Since we are only returning one. So we SELECT DISTINCT ON (l.id) and ORDER_BY a.id
        const topSongs = await this.#sql`
            SELECT DISTINCT ON (s.id)
                s.*,
                a.image as album_image,
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ar.id, 'name', ar.name)) as artists,
                COUNT(DISTINCT l.id) as listen_count
            FROM
                listens l
            JOIN
                songs s ON l.song_id = s.id
            JOIN
                album_songs als ON s.id = als.song_id
            JOIN
                albums a ON als.album_id = a.id
            JOIN
                artist_songs ars ON s.id = ars.song_id
            JOIN
                artists ar ON ars.artist_id = ar.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp 
                    ${start_date ? 
                        this.#sql`BETWEEN ${start_date} AND ${end_date}` : 
                        this.#sql`<= ${end_date}`}
            GROUP BY
                s.id, a.id
            ORDER BY
                s.id, listen_count DESC
            ${n ? this.#sql`LIMIT ${n}` : this.#sql``}`
        return topSongs
    }

    // end_date is required, and one of start_date or n is required
    async getListens({ user_id, start_date, end_date, n }) {
        // When a song is linked to multiple albums, some albums will have to be ignored 
        // Since we are only returning one. So we SELECT DISTINCT ON (l.id) and ORDER_BY a.id
        const listens = await this.#sql`
            SELECT DISTINCT ON (l.id)
                l.id as listen_id,
                l.time_stamp as time_stamp,
                ROW_TO_JSON(s) as song,
                ROW_TO_JSON(a) as album,
                -- JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', a.id, 'name', a.name)) as album,
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', ar.id, 'name', ar.name)) as artists
            FROM
                listens l
            JOIN
                songs s ON l.song_id = s.id
            JOIN
                album_songs als ON s.id = als.song_id
            JOIN
                albums a ON als.album_id = a.id
            JOIN
                artist_songs ars ON s.id = ars.song_id
            JOIN
                artists ar ON ars.artist_id = ar.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp 
                    ${start_date ? 
                        this.#sql`BETWEEN ${start_date} AND ${end_date}` : 
                        this.#sql`<= ${end_date}`}
            GROUP BY
                l.id, s.id, a.id
            ORDER BY
                l.id, time_stamp, a.id 
                DESC
            ${n ? this.#sql`LIMIT ${n}` : this.#sql``}`
        return listens
    }

    async getAlbumRatings(user_id) {
        const albumRatings = await this.#sql`
            SELECT 
                ao.id AS rating_id,
                ao.album_id,
                ao.rating,
                ao.review,
                ao.time_stamp
            FROM 
                album_opinions ao
            WHERE 
                ao.user_id = ${user_id}
            ORDER BY 
                ao.time_stamp DESC
        `
        return albumRatings
    }  
    
    async getSongRatings(user_id) {
        const songRatings = await this.#sql`
            SELECT 
                so.id AS rating_id,
                so.song_id,
                so.rating,
                so.review,
                so.time_stamp
            FROM 
                song_opinions so
            WHERE 
                so.user_id = ${user_id}
            ORDER BY 
                so.time_stamp DESC
        `
        return songRatings
    }    

    async getSongsByHour({ userId, date }) {
        const result = await this.#sql`
            SELECT
                EXTRACT(HOUR FROM l.time_stamp) AS hour,
                COUNT(*) AS listen_count
            FROM
                listens l
            JOIN
                songs s ON l.song_id = s.id
            WHERE
                l.user_id = ${userId}
                AND DATE(l.time_stamp) = ${date}
            GROUP BY
                hour
            ORDER BY
                hour ASC`
        return result
    }

    async getUserSongRatingStats(user_id) {
        const result = await this.#sql`
            SELECT 
                AVG(rating)::NUMERIC(5, 2) AS average_rating, 
                COUNT(rating) AS num_ratings
            FROM 
                song_opinions
            WHERE 
                user_id = ${user_id}
                AND rating IS NOT NULL
        `
        
        return result[0]
    }

    async getUserAlbumRatingStats(user_id) {
        const result = await this.#sql`
            SELECT 
                AVG(rating)::NUMERIC(5, 2) AS average_rating, 
                COUNT(rating) AS num_ratings
            FROM 
                album_opinions
            WHERE 
                user_id = ${user_id}
                AND rating IS NOT NULL
        `
        
        return result[0]
    }   
}