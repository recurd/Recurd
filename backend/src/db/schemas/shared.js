import { z } from "zod"

export const timestampSchemaT = z.union(
    [
        z.number().int(), // epoch time in milliseconds
        z.string().datetime() // ISO 8601 datetime string, no time zone offest
    ]).pipe(z.coerce.date()) // coerce to Date object