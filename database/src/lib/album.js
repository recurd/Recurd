import sql from '../db.js'

export async function getAlbum(id) {
    const [result] = await sql`
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
export async function getAlbumTracks(id) {
    const result = await sql`
        SELECT
            s.*,
            abs.disc_number AS disc_number,
            abs.album_position AS album_position
        FROM
            album_songs abs
        JOIN
            songs s ON abs.song_id = s.id
        WHERE
            abs.album_id = ${id}
        ORDER BY
            abs.disc_number ASC NULLS LAST,
            abs.album_position ASC NULLS LAST,
            s.name DESC`
    return result
}

// Return an array of { rating: int, count: int }. Note that if a rating is 0, no corresponding object will be returned
export async function getAlbumRatings(id) {
    const result = await sql`
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

export async function getAlbumAvgRating(id) {
    const [result] = await sql`
        SELECT
            AVG(rating) AS average
        FROM
            album_opinions
        WHERE
            album_id = ${id}
            AND rating IS NOT NULL`
    return result
}

export async function getAlbumReviews(id) {
    const result = await sql`
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
