export default class User {
    #sql

    constructor(sql) {
        this.#sql = sql
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

    // returns true if user is connected to this service, false otherwise
    async getStatus(user_id, service_type) {
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