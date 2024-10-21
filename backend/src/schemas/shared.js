import { z } from "zod"

export const nonEmptyStrSchema = z.string().min(1)

// Coerce only number to string
export const coerceStrSchemaT = z.string().or(z.number()).pipe(z.coerce.string())

// Coerce only string to number
// Prevent empty string from being coerced to 0
export const coerceNumSchemaT = nonEmptyStrSchema.or(z.number()).pipe(z.coerce.number())

export const idSchema = nonEmptyStrSchema.uuid()

export const urlSchema = nonEmptyStrSchema.url()

export const timestampSchemaT = z.union(
    [
        coerceNumSchemaT.pipe(z.number().int()), // epoch time in milliseconds
        z.string().datetime({ message: "Timestamp must either be a string in ISO 8601 format (with UTC timezone), or an integer representing epoch time (in milliseconds)." })
    ]).pipe(z.coerce.date()) // coerce to Date object