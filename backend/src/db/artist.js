import sql from './db.js'

export async function getArtist(id) {
    const [result] = await sql`
            SELECT
                *
            FROM
                artists a
            WHERE
                a.id = ${id}`
    return result
}

export async function getArtistAlbums(id, limit) {
    const result = await sql`
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
                sql`LIMIT ${limit}` : sql``}`
    return result
}

export async function getArtistSongs(id, limit) {
    const result = await sql`
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
                sql`LIMIT ${limit}` : sql``}`
    return result
}