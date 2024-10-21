import sql from '../db.js'

export async function getSong(id) {
    return await sql`
        SELECT * 
        FROM    songs s
        WHERE   s.id = ${id}`
}