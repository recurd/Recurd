import sql from "./db.js"

// Param song (Required): must contain 'name' field
// Param songArtists (Required): an array of at least one element, each artist must contain 'name' field
// Param album (Optional): must contain 'name' field
// Param albumArtists (Optional): an array of at least one element, each artist must contain 'name' field
// Returned: song and album objects,
// all objects (however nested) has 'found' field that is true iff the object was found in DB
export async function findOrInsertSongArtistAlbum(song, songArtists, album, albumArtists) {
    let outSong = await findOrInsertSong(song, songArtists)

    let outAlbum = null
    // If song was found (not created), fetch album by name
    if (album && outSong.found) {
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
    if (album && !outAlbum) {
        outAlbum = await findOrInsertAlbum(album, albumArtists)

        if (!outAlbum.found) {
            // Insert into album_songs
            const album_song = { 
                album_id: outAlbum.id,
                song_id: outSong.id
            }
            if (song?.disc_number) {
                outSong.disc_number = song.disc_number
                album_song.disc_number = song.disc_number
            }
            if (song?.album_position) {
                outSong.album_position = song.album_position
                album_song.album_position = song.album_position
            }
            await sql`
                INSERT INTO album_songs ${sql(album_song)}`
        }
    }
    return { song: outSong, album: outAlbum }
}

// Param song: must contain 'name' field
// Param songArtists: an array of at least one element, each artist must contain 'name' field
// Returned: song, has 'found' field that is true iff the object was found in DB
// NOT CONCURRENTLY SAFE
async function findOrInsertSong(song, songArtists) {
    const artist_names = songArtists.map(e=>e.name)
    let outSong = null

    // Find song by exact match on song name and artist names
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
        const artists = await findOrInsertArtists(songArtists)

        // Insert song
        const [res_song] = await sql`
            INSERT INTO songs ${sql(song, 'name', 'image')}
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

// Param album: must contain 'name' field
// Param albumArtists: each artist must contain 'name' field
// Returned: album object, has 'found' field that is true iff the object was found in DB.
// Each of album's artists has 'found' field as well
// NOT CONCURRENTLY SAFE
async function findOrInsertAlbum(album, albumArtists) {
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
        const artists = await findOrInsertArtists(albumArtists)

        // Insert album
        let albumColumns = ['name', 'image', 'release_date']
        if (album?.album_type) albumColumns.push('album_type') 
            // album_type has constraint: not null default, so either not in column list or inserted as not null
        const [res_album] = await sql`
            INSERT INTO albums ${sql(album, albumColumns)}
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

// Param artists: an array, each artist must contain 'name' field
// Param albumArtists: an array of at least one element, each artist must contain 'name' field
// Returned: artists object, each has 'found' field that is true iff the object was found in DB
// NOT CONCURRENTLY SAFE
async function findOrInsertArtists(artists) {
    // create temp table with same type as artists (excluding id column)
    await sql`
        CREATE TEMPORARY TABLE temp_artists (LIKE artists); 
        ALTER TABLE temp_artists DROP COLUMN id`.simple() 
    await sql`INSERT INTO temp_artists ${sql(artists, 'name', 'image', 'description')}`
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
    await sql`DROP TABLE temp_artists`
    return res
}