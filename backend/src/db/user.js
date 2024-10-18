import sql from "./db.js"
import { getAccessToken, insertUserService } from "../../db/user.js"

// return bool indicating success/failure
export async function insertUserService({ user_id, service_type, access_token, refresh_token, expires_at }) {
    const dbRes = await sql`
        INSERT INTO user_services ${
            sql({ 
                user_id: user_id, 
                service_id: sql`
                    (SELECT 
                        id
                    FROM
                        user_services_t
                    WHERE
                        service_type = ${service_type})`,
                access_token: access_token,
                refresh_token: refresh_token,
                expires_at: expires_at
            })} 
        ON CONFLICT 
            (user_id, service_id) 
        DO UPDATE SET 
            access_token = excluded.access_token, 
            refresh_token = excluded.refresh_token,
            expires_at = excluded.expires_at`
    return dbRes.count > 0
}

async function getUserServices(user_id, service_type) {
    const result = await sql`
        SELECT 
            *
        FROM
            user_services_t
        WHERE
            user_id = ${user_id}
            AND sevice_type = ${service_type}`
    if (result.count > 0)
        return result[0]
    // otherwise return undefined
}

export async function getAccessToken(user_id, service_type) {
    const result = await getUserServices(user_id, service_type)
    if (result) return result.access_token
    // otherwise return undefined
}

export async function getRefreshToken(user_id, service_type) {
    const result = await getUserServices(user_id, service_type)
    if (result) return result.refresh_token
    // otherwise return undefined
}