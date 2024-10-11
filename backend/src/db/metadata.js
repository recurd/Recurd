import sql from "./db.js"

// artists is an array, each artist must contain name field
async function insertOrFindArtists(artists) {
    try {
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
    } catch (e) { return Promise.reject(e) }
}

export { insertOrFindArtists }