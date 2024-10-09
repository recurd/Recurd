import { Router } from "express"
import sql from '../db/db.js'

const router = Router()

// Get top (n) artist id, artist name, artist image, listen count (per artist)
router.get('/top-artists', async (req, res, next) => {
    const { user_id, start_date, end_date, n } = req.query;

    // Check that all required parameters are present
    if (!user_id || !start_date || !end_date || !n) {
        return res.status(400).json({ message: "user_id, start_date, end_date, and n are required." });
    }

    const start = new Date(req.query.start_date).toISOString();
    const end = new Date(req.query.end_date).toISOString();
    let count = parseInt(req.query.n, 10);
    if (isNaN(count) || count <= 0) {
        return res.status(400).json({ message: "n must be a positive integer." });
    }

    try {
        const topArtists = await sql`
            SELECT
                ar.id AS artist_id,
                ar.name AS artist_name,
                COUNT(*) AS listen_count
            FROM
                listens l
            JOIN
                artist_songs ars ON l.song_id = ars.song_id
            JOIN
                artists ar ON ars.artist_id = ar.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp BETWEEN ${start} AND ${end}
            GROUP BY
                ar.id, ar.name
            ORDER BY
                listen_count DESC
            LIMIT ${count};
        `;

        return res.status(200).json(topArtists);
    } catch (e) {
        return next(e)
    }
});

// Get top (n) album id, album name, album image, listen count (per album)
router.get('/top-albums', async (req, res, next) => {
    const { user_id, start_date, end_date, n } = req.query;

    if (!user_id || !start_date || !end_date || !n) {
        return res.status(400).json({ message: "user_id, start_date, end_date, and n are required." });
    }

    const start = new Date(req.query.start_date).toISOString();
    const end = new Date(req.query.end_date).toISOString();
    let count = parseInt(req.query.n, 10);
    if (isNaN(count) || count <= 0) {
        return res.status(400).json({ message: "n must be a positive integer." });
    }

    try {
        const topAlbums = await sql`
            SELECT
                a.id AS album_id,
                a.name AS album_name,
                a.image AS album_image,
                COUNT(l.id) AS listen_count
            FROM
                listens l
            JOIN
                album_songs als ON l.song_id = als.song_id
            JOIN
                albums a ON als.album_id = a.id
            WHERE
                l.user_id = ${user_id}
                AND l.time_stamp BETWEEN ${start} AND ${end}
            GROUP BY
                a.id, a.name, a.image
            ORDER BY
                listen_count DESC
            LIMIT ${count}; -- Safely inject validated count here
        `;

        res.json(topAlbums);
    } catch (e) {
        return next(e)
    }
});


// Get top (n) song id, song name, album name, album image, artist name
router.get('/top-songs', async (req, res, next) => {
    const { user_id, start_date, end_date, n } = req.query;

    if (!user_id || !start_date || !end_date || !n) {
        return res.status(400).json({ message: "user_id, start_date, end_date, and n are required." });
    }

    const start = new Date(req.query.start_date).toISOString();
    const end = new Date(req.query.end_date).toISOString();
    let count = parseInt(req.query.n, 10);
    if (isNaN(count) || count <= 0) {
        return res.status(400).json({ message: "n must be a positive integer." });
    }

    try {
        const topSongs = await sql`
            SELECT
                s.id as song_id,
                s.name as song_name,
                a.name as album_name,
                a.image as album_image,
                ARRAY_AGG(DISTINCT ar.name) as artist_names,
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
                AND l.time_stamp BETWEEN ${start} AND ${end}
            GROUP BY
                s.id, s.name, a.name, a.image
            ORDER BY
                listen_count DESC
            LIMIT ${count};
        `;

        res.json(topSongs);
    } catch (e) {
        return next(e)
    }
});


export default router;
