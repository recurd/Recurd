import sql from "./db.js"

export async function getUserByUsername(username) {
    const [user] = await sql`SELECT * FROM users WHERE username = ${username}`
    return user
}

export async function insertUser({ username, password, display_name }) {
    return await sql`INSERT INTO USERS ${sql({ username, password, display_name })}`
}

export async function getUserTopArtists({ user_id, start_date, end_date, n }) {
    const topArtists = await sql`
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
            AND l.time_stamp BETWEEN ${start_date} AND ${end_date}
        GROUP BY
            ar.id
        ORDER BY
            listen_count DESC
        LIMIT ${n}`
    return topArtists
}

export async function getUserTopAlbums({ user_id, start_date, end_date, n }) {
    const topAlbums = await sql`
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
            AND l.time_stamp BETWEEN ${start_date} AND ${end_date}
        GROUP BY
            a.id
        ORDER BY
            listen_count DESC
        LIMIT ${n}`
    return topAlbums
}

export async function getUserTopSongs({ user_id, start_date, end_date, n }) {
    // When a song is linked to multiple albums, some albums will have to be ignored 
    // Since we are only returning one. So we SELECT DISTINCT ON (l.id) and ORDER_BY a.id
    const topSongs = await sql`
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
            AND l.time_stamp BETWEEN ${start_date} AND ${end_date}
        GROUP BY
            s.id, a.id
        ORDER BY
            s.id, listen_count DESC
        LIMIT ${n}`
    return topSongs
}

// end_date is required, and one of start_date or n is required
export async function getUserListens({ user_id, start_date, end_date, n }) {
    // When a song is linked to multiple albums, some albums will have to be ignored 
    // Since we are only returning one. So we SELECT DISTINCT ON (l.id) and ORDER_BY a.id
    const listens = await sql`
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
                    sql`BETWEEN ${start_date} AND ${end_date}` : 
                    sql`<= ${end_date}`}
        GROUP BY
            l.id, s.id, a.id
        ORDER BY
            l.id, time_stamp, a.id 
            DESC
        ${!n && n !== 0 ? sql`LIMIT ${n}` : sql``}`
    return listens
}