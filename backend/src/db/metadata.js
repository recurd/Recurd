import sqlDf from "./db.js"
import { removeNullish } from "./util.js"

export async function insertListen(insert_listen, sql=sqlDf) {
    // insert_listen is { user_id, song_id, time_stamp }
    removeNullish(insert_listen)
    const [res] = await sql`
        INSERT INTO listens ${sql(insert_listen)}
        RETURNING id as listen_id, time_stamp`
    return res
}

// Param song (Required): must contain 'name' field
// Param songArtists (Required): an array of at least one element, each artist must contain 'name' field
// Param album (Optional): must contain 'name' field
// Param albumArtists (Optional): an array of at least one element, each artist must contain 'name' field
// Returned: song and album objects,
// all objects (however nested) has 'found' field that is true iff the object was found in DB
export async function findOrInsertSongArtistAlbum({ song, songArtists, album, albumArtists }, sql=sqlDf) {
    let outSong = await findOrInsertSong({ song, songArtists }, sql)

    const hasAlbum = !!album
    let outAlbum = null
    // If song was found (not created), fetch album by name
    if (hasAlbum && outSong.found) {
        if (!album?.name) throw 'album must have a name!'
        const [resAlbum] = await sql`
            SELECT 
                *,
                true AS found
            FROM songs s
            JOIN album_songs abs
            ON s.id = abs.song_id
            JOIN albums ab
            ON abs.album_id = ab.id
            WHERE s.id = ${outSong.id}
                ${album.name ? sql`AND ab.name = ${album.name}` : sql``}
            LIMIT 1`
            outAlbum = resAlbum
    }
    // If haven't found album, create one when album is specified
    if (hasAlbum && !outAlbum) {
        outAlbum = await findOrInsertAlbum({ album, albumArtists: albumArtists ?? songArtists }, sql)

        if (!outAlbum.found) {
            // Insert into album_songs
            const album_song = { 
                album_id: outAlbum.id,
                song_id: outSong.id,
                disc_number: song.disc_number,
                album_position: song.album_position
            }
            outSong.disc_number = song.disc_number
            outSong.album_position = song.album_position
            removeNullish(album_song)
            await sql`
                INSERT INTO album_songs ${sql(album_song)}`
        }
    }
    return { song: outSong, album: outAlbum }
}

// NOT CONCURRENTLY SAFE
async function findOrInsertSong({ song, songArtists }, sql=sqlDf) {
    const artist_names = songArtists.map(e=>e.name)
    let outSong = null

    // Find song by exact match on song name and artist names
    if (!song?.name) throw 'song must have a name!'
    const [matchedSA] = await sql`
        SELECT 
                row_to_json(s) song,
                json_agg(row_to_json(ar)) artists
        FROM    songs s
        JOIN    artist_songs ars
        ON      s.id = ars.song_id
        JOIN    artists ar
        ON      ars.artist_id = ar.id
        WHERE   s.name = ${song.name}
        GROUP BY s.id
        HAVING  array_agg(ar.name) @> ${artist_names}
            AND array_agg(ar.name) <@ ${artist_names};` // set equality (of arrays)

    // If a match is encountered, the song exists, so retrieve data
    if (matchedSA) {
        outSong = {
            ...matchedSA.song,
            artists: matchedSA.artists.map(e=>{ return {...e, found: true} }),
            found: true
        }
    }
    // Otherwise, insert all artists whose names are not present
    // Then insert song, and insert into artist_songs
    else {
        // Insert artists
        const artists = await findOrInsertArtists(songArtists, sql)

        // Insert song
        const [res_song] = await sql`
            INSERT INTO songs ${sql(song)}
            RETURNING *`
        outSong = { 
            ...res_song, 
            artists: artists,
            found: false
        }
        console.log('song created with id: ', outSong.id)

        // Insert into artist_songs
        const artist_song_inserts = artists.map(e => { // build values to insert into artist songs
            return {
                artist_id: e.id,
                song_id: outSong.id
            }
        }) 
        await sql`INSERT INTO artist_songs ${sql(artist_song_inserts)}`
    }
    return outSong
}

// NOT CONCURRENTLY SAFE
async function findOrInsertAlbum({ album, albumArtists }, sql=sqlDf) {
    const artist_names = albumArtists.map(e=>e.name)
    let outAlbum = null

    // Find album and artists by exact match on album name and artist names
    const [matchedAA] = await sql`
        SELECT 
                row_to_json(a) album,
                json_agg(row_to_json(ar)) artists
        FROM    albums a
        JOIN    artist_albums aas
        ON      a.id = aas.album_id
        JOIN    artists ar
        ON      aas.artist_id = ar.id
        WHERE   a.name = ${album.name}
        GROUP BY a.id
        HAVING  array_agg(ar.name) @> ${artist_names}
            AND array_agg(ar.name) <@ ${artist_names}` // set equality (of arrays)

    // If a match is encountered, the song exists, so retrieve data
    if (matchedAA) {
        outAlbum = { 
            ...matchedAA.album, 
            artists: matchedAA.artists.map(e => { return {...e, found: true} }),
            found: true
        }
        console.log('found album:', outAlbum)
    } 
    // Otherwise, insert all artists whose names are not present
    // Then insert album, and insert into artist_albums
    else  {
        // Insert artists
        const artists = await findOrInsertArtists(albumArtists, sql)

        // Insert album
        removeNullish(album)
        const [res_album] = await sql`
            INSERT INTO albums ${sql(album)}
            RETURNING *`
        outAlbum = { 
            ...res_album, 
            artists: artists,
            found: false
        }
        console.log('album created with id: ', outAlbum.id)

        // Insert into artist_albums
        const artist_album_inserts = artists.map(e => { // build values to insert into artist songs
            return {
                artist_id: e.id,
                album_id: outAlbum.id
            }
        })
        await sql`INSERT INTO artist_albums ${sql(artist_album_inserts)}`
    }
    return outAlbum
}

// NOT CONCURRENTLY SAFE
async function findOrInsertArtists(artists, sql=sqlDf) {
    try {
        // create temp table with same type as artists (excluding id column)
        await sql`
            CREATE TEMPORARY TABLE temp_artists (LIKE artists); 
            ALTER TABLE temp_artists DROP COLUMN id`.simple() 
        artists.forEach(e => removeNullish(e))
        await sql`INSERT INTO temp_artists ${sql(artists)}`
        const res = await sql`
            WITH existed AS (
                SELECT *
                FROM artists 
                WHERE name IN (SELECT name FROM temp_artists)
            ), inserted AS (
                INSERT INTO artists (name, image, description)
                SELECT *
                FROM temp_artists ta
                WHERE NOT EXISTS (SELECT name FROM existed WHERE name = ta.name)
                RETURNING *
            )
            SELECT *, TRUE AS found FROM existed
            UNION
            SELECT *, FALSE AS found FROM inserted`
        // console.log('artists created and/or found:', artists)
        return res
    } finally {
        await sql`DROP TABLE temp_artists`
    } // let error propogate up
}
