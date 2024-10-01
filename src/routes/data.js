import { Router } from "express"
import bcrypt from "bcrypt"
import sql from '../db/db.js'
import { ErrorCodes as PgErrorCodes, isDBError } from '../db/util.js'
import authGate from "../authGate.js"

const router = Router()

// Will have to figure out how to get top artists from songs with multiple artists / artists in an album
router.get('/top-artists', (req, res) => {

});

/*
    Returns a list of n objects by listen count:
    {
        "album_id": "9674d959-e42b-4e55-a76a-18058b778a4c",
        "album_name": "Quangs EP",
        "album_image": "",
        "listen_count": "2"
    }...
*/
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
            LIMIT ${n};  -- Use the n parameter to limit results
        `;

        res.json(topAlbums);
    } catch (error) {
        next(error);
    }
});


router.get('/top-songs', (req, res) => {
    
});

export default router;