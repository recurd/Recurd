import { Router } from "express"
import bcrypt from "bcrypt"
import sql from '../db/db.js'
import { ErrorCodes as PgErrorCodes, isDBError } from '../db/util.js'
import authGate from "../authGate.js"

const router = Router()

// Get top (n) artist id, artist name, artist image, listen count (per artist)
router.get('/top-artists', async (req, res) => {
    const { user_id, start_date, end_date, n} = req.query;

    if (!user_id || !start_date || !end_date || !n) {
        return res.status(400).json({ message: "user_id, start_date, end_date, and n are required." });
    }

    try {
        const topArtists = await sql`
            SELECT
                ar.id AS artist_id,
                ar.name AS artist_name,
                ar.image AS artist_image,
                COUNT(l.id) AS listen_count
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
                ar.id, ar.name, ar.image
            ORDER BY
                listen_count DESC
            LIMIT ${n};
        `
    } catch (error) {
        return res.status(500).json({ error: "Failed to get top artists." });
    }
});

// Get top (n) album id, album name, album image, listen count (per album)
router.get('/top-albums', async (req, res, next) => {
    const { user_id, start_date, end_date, n } = req.query;

    if (!user_id || !start_date || !end_date || !n) {
        return res.status(400).json({ message: "user_id, start_date, end_date, and n are required." });
    }

    try {
        const topAlbums = await sql`
            SELECT
                a.id AS album_id,
                a.name AS album_name,
                a.image AS album_image,
                COUNT(l.song_id) AS listen_count
            FROM
                listens l
            JOIN
                album_songs als ON l.song_id = als.song_id
            JOIN
                albums a ON als.album_id = a.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp BETWEEN ${start_date} AND ${end_date}
            GROUP BY
                a.id, a.name, a.image
            ORDER BY
                listen_count DESC
            LIMIT ${n};
        `;

        res.json(topAlbums);
    } catch (error) {
        return res.status(500).json({ error: "Failed to get top albums." });
    }
});

// Get top (n) song id, song name, album name, album image, artist name
router.get('/top-songs', async (req, res) => {
    const { user_id, start_date, end_date, n} = req.query;

    if (!user_id || !start_date || !end_date || !n) {
        return res.status(400).json({ message: "user_id, start_date, end_date, and n are required." });
    }

    try {
        const topSongs = await sql `
            SELECT
                s.id as song_id,
                s.name as song_name,
                a.name as album_name,
                a.image as album_image,
                ar.name as artist_name,
                COUNT(l.id) as listen_count
            FROM
                listens l
            JOIN
                songs s ON l.song_id = s.id
            JOIN
                album_songs als ON s.id = als.song_id
            JOIN
                albums a ON als.album_id = a.id
            JOIN
                artist_albums ara ON a.id = ara.album_id
            JOIN
                artists ar ON ara.artist_id = ar.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp BETWEEN ${start_date} and ${end_date}
            GROUP BY
                s.id, s.name, a.name, a.image, ar.name
            ORDER BY
                listen_count DESC
            LIMIT ${n};
        `;
    
        res.json(topSongs);
    } catch (error) {
        return res.status(500).json({ error: "Failed to get top songs." });
    }
});

export default router;