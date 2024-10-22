import sql from '../db.js'

export async function getSong(id) {
    return await sql`
        SELECT * 
        FROM    songs s
        WHERE   s.id = ${id}`
}

export async function getSongAlbums(id) {
    const result = await sql`
        SELECT a.*
        FROM albums a
        JOIN album_songs abs ON a.id = abs.album_id
        WHERE abs.song_id = ${id}
        ORDER BY a.release_date DESC
    `
    return result
}

export async function getSongRatings(id) {
    const result = await sql`
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

export async function getSongReviews(id) {
    const result = await sql`
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

export async function getTopListeners({ id, start_date, end_date, n }) {
    const result = await sql`
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
                    sql`BETWEEN ${start_date} AND ${end_date}` : 
                    sql`<= ${end_date}`}
        GROUP BY 
            l.user_id, u.id
        ORDER BY 
            listen_count DESC
        ${n ? sql`LIMIT ${n}` : sql``}`
    return result
}