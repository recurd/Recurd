import sql from "./db.js"

// return bool indicating success/failure
export async function insertUserService({ user_id, service_type, access_token, refresh_token, expires_at }) {
    const dbRes = await sql`
        insert into user_services ${
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