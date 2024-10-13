import { z } from "zod"

// Coerce only number to string
export const coerceStrSchemaT = z.string().or(z.number()).pipe(z.coerce.string())

// Coerce only string to number
export const coerceNumSchemaT = z.string().or(z.number()).pipe(z.coerce.number())

export const nonEmptyStrSchema = z.string().min(1)

export const idSchema = nonEmptyStrSchema.uuid()

export const urlSchema = nonEmptyStrSchema.url()

export const timestampSchemaT = z.union(
    [
        coerceNumSchemaT.pipe(z.number().int()), // epoch time in milliseconds
        z.string().datetime({ message: "Datetime string must be in ISO 8601 format and in UTC timezone" })
    ]).pipe(z.coerce.date()) // coerce to Date object