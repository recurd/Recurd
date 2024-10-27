export default class UserService {
    #sql

    constructor(sql) {
        this.#sql = sql
    }

    async get(user_id, service_type) {
        const result = await this.#sql`
            SELECT 
                *
            FROM
                user_services us
            JOIN
                user_services_t ut
            ON
                us.service_id = ut.id
            WHERE
                user_id = ${user_id}
                AND ut.service_type = ${service_type}`
        if (result.count > 0)
            return result[0]
        // otherwise return undefined
    }

    async getAccessToken(user_id, service_type) {
        const result = await this.get(user_id, service_type)
        if (result) return result.access_token
        // otherwise return undefined
    }

    async getRefreshToken(user_id, service_type) {
        const result = await this.get(user_id, service_type)
        if (result) return result.refresh_token
        // otherwise return undefined
    }

    // returns true if user is connected to this service, false otherwise
    async isConnected(user_id, service_type) {
        const result = await this.#sql`
            SELECT
                1
            FROM
                user_services us
            JOIN
                user_services_t ut
            ON 
                us.service_id = ut.id
            WHERE
                    us.user_id = ${user_id}
                AND
                    ut.service_type = ${service_type}`
        return result.count > 0
    }

    // return bool indicating success/failure
    async insert({ user_id, service_type, access_token, refresh_token, expires_at }) {
        const dbRes = await this.#sql`
            insert into user_services ${
                this.#sql({ 
                    user_id: user_id, 
                    service_id: this.#sql`
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

    // return true for updating successfully
    async setLastUpdated(user_id, service_type, last_updated) {
        const result = await this.#sql`
            UPDATE
                user_services us
            SET 
                last_updated = ${last_updated}
            WHERE 
                user_id = ${user_id}
                AND service_id = ( 
                    SELECT 
                        id 
                    FROM 
                        user_services_t ut 
                    WHERE 
                        ut.service_type = ${service_type}
                )`
        return result.count > 0
    }

    // returns true if user's service was deleted, false if user wasn't connected to the service
    async delete(user_id, service_type) {
        const result = await this.#sql`
            DELETE FROM
                user_services
            WHERE 
                    user_id = ${user_id}
                AND
                    service_id = 
                        (SELECT
                            id
                        FROM
                            user_services_t
                        WHERE
                            service_type = ${service_type})`
        return result.count > 0
    }
}