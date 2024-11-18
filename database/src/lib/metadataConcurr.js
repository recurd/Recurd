// Concurrently safe insertion of metadata
import { LockType } from "./locktype.js"
import { hashString } from "../util.js"
import { removeNullish } from "../util.js"

export default class Metadata {
    #sql

    constructor(sql) {
        this.#sql = sql
    }

    // Exported function, with no transaction context
    // see private function for what 'data' is
    async findOrInsertSongArtistAlbum(data) {
        // Need to be in a transaction to execute #findOrInsertSongArtistAlbum()
        const result = await this.#sql.begin(async sqlTxact => {
            return await findOrInsertSongArtistAlbumTxact(data, sqlTxact)
        })
        return result
    }
}

// Internal function, with transaction context
// Param song (Required): must contain 'name' field
// Param songArtists (Required): an array of at least one element, each artist must contain 'name' field
// Param album (Optional): must contain 'name' field
// Param albumArtists (Optional): an array of at least one element, each artist must contain 'name' field
// Returned: song and album objects,
// all objects (however nested) has 'found' field that is true iff the object was found in DB
export async function findOrInsertSongArtistAlbumTxact({ song, trackInfo, songArtists, album, albumArtists }, sqlTxact) {
    const outSong = await findOrInsertSong({ song: song, songArtists }, sqlTxact)
    // if album input does not exist, return
    if (!album) {
        return { song: outSong }
    }

    let outAlbum = null
    // If song was found (not created), fetch album by name
    if (outSong.found) {
        if (!album?.name) throw 'album must have a name!'
        const [resAlbum] = await sqlTxact`
            SELECT 
                ab.*,
                abs.disc_number as disc_number, -- include these columns from album_songs for returning track object
                abs.album_position as album_position,
                true AS found
            FROM songs s
            JOIN album_songs abs
            ON s.id = abs.song_id
            JOIN albums ab
            ON abs.album_id = ab.id
            WHERE s.id = ${outSong.id}
                AND ab.name = ${album.name}
            LIMIT 1`
            outAlbum = resAlbum
    }

    // If found album
    if (outAlbum) {
        // extract track info and remove it from album
        outSong.disc_number = outAlbum.disc_number
        outSong.album_position = outAlbum.album_position
        delete outAlbum.disc_number
        delete outAlbum.album_position
    }
    // If haven't found album, create one when album is specified
    else {
        outAlbum = await findOrInsertAlbum({ album, albumArtists: albumArtists ?? songArtists }, sqlTxact)
        outSong.disc_number = trackInfo?.disc_number
        outSong.album_position = trackInfo?.album_position
    }

    // If either song or album did not exist, then link them in album_songs
    if (!outSong.found || !outAlbum.found) {
        const album_song = { 
            album_id: outAlbum.id,
            song_id: outSong.id,
            disc_number: trackInfo?.disc_number,
            album_position: trackInfo?.album_position
        }
        removeNullish(album_song)
        await sqlTxact`
            INSERT INTO album_songs ${sqlTxact(album_song)}`
    }
    return {
        song: outSong,
        album: outAlbum
    }
}

// Internal function, with transaction context
// NOT CONCURRENTLY SAFE
async function findOrInsertSong({ song, songArtists }, sqlTxact) {
    const artist_names = songArtists.map(e=>e.name)
    let outSong = null

    // Find song by exact match on song name and artist names
    if (!song?.name) throw 'song must have a name!'
    const [matchedSA] = await sqlTxact`
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
        const artists = await findOrInsertArtists(songArtists, sqlTxact)

        // Insert song
        const [res_song] = await sqlTxact`
            INSERT INTO songs ${sqlTxact(song)}
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
        await sqlTxact`INSERT INTO artist_songs ${sqlTxact(artist_song_inserts)}`
    }
    return outSong
}

// Internal function, with transaction context
// NOT CONCURRENTLY SAFE
async function findOrInsertAlbum({ album, albumArtists }, sqlTxact) {
    const artist_names = albumArtists.map(e=>e.name)
    let outAlbum = null

    // Find album and artists by exact match on album name and artist names
    const [matchedAA] = await sqlTxact`
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

    // If a match is encountered, the album exists, so retrieve data
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
        const artists = await findOrInsertArtists(albumArtists, sqlTxact)

        // Insert album
        removeNullish(album)
        const [res_album] = await sqlTxact`
            INSERT INTO albums ${sqlTxact(album)}
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
        await sqlTxact`INSERT INTO artist_albums ${sqlTxact(artist_album_inserts)}`
    }
    return outAlbum
}

// Internal function, with transaction context
// NOT CONCURRENTLY SAFE
async function findOrInsertArtists(artists, sqlTxact) {
    // Sort artist by names (alphabetically) to ensure locking in predetermined order
    artists.sort((a, b) => a.name.localeCompare(b.name))

    const resArtists = []
    // For each artist,
    // 1. Lock by name
    // 2. Insert into table, if exists do nothing and grab existing info
    // 3. Unlock
    for (const artist of artists) {
        await sqlTxact`SELECT pg_advisory_xact_lock(${LockType.ARTIST}, ${hashString(artist.name)})`

        const [rArtist] = await sqlTxact`
            INSERT INTO artists 
                ${sqlTxact(artist, 'name', 'image', 'description')}
                WHERE NOT EXISTS (SELECT name FROM existed WHERE name = ta.name)
                RETURNING *`
        resArtists.push(rArtist)
        await sqlTxact`SELECT pg_advisory_xact_unlock(${LockType.ARTIST}, ${hashString(artist.name)})`
    }

    // try {
    //     // create temp table with same type as artists (excluding id column)
    //     await sqlTxact`
    //         CREATE TEMPORARY TABLE temp_artists (LIKE artists); 
    //         ALTER TABLE temp_artists DROP COLUMN id`.simple() 
    //     artists.forEach(e => removeNullish(e))
    //     await sqlTxact`INSERT INTO temp_artists ${sqlTxact(artists)}`
    //     const res = await sqlTxact`
    //         WITH existed AS (
    //             SELECT *
    //             FROM artists 
    //             WHERE name IN (SELECT name FROM temp_artists)
    //         ), inserted AS (
    //             INSERT INTO artists (name, image, description)
    //             SELECT *
    //             FROM temp_artists ta
    //             WHERE NOT EXISTS (SELECT name FROM existed WHERE name = ta.name)
    //             RETURNING *
    //         )
    //         SELECT *, TRUE AS found FROM existed
    //         UNION
    //         SELECT *, FALSE AS found FROM inserted`
    //     // console.log('artists created and/or found:', artists)
    //     return res
    // } finally {
    //     await sqlTxact`DROP TABLE temp_artists`
    // } // let error propogate up
}