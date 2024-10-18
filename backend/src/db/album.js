import sql from './db.js'

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

export async function getAlbumSongs(id) {
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

export async function getAlbumRatings(id) {
    const result = await sql`
        WITH def AS (
            SELECT 
                n as rating,
                0::integer as count
            FROM
                generate_series(1,10) n
        ), res AS (
            SELECT
                aos.rating as rating,
                COUNT(aos.rating)::integer as count
            FROM
                album_opinions aos
            WHERE
                aos.album_id = ${id}
                AND aos.rating IS NOT NULL
            GROUP BY
                aos.rating
        )
        SELECT * FROM res
        UNION ALL
        SELECT * FROM def
        WHERE NOT EXISTS (
            SELECT * FROM res WHERE res.rating = def.rating
        )
        ORDER BY
            rating ASC`
    return result
}