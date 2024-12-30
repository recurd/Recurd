import { z } from "zod"

export const nonEmptyStrSchema = z.string().min(1)

// Coerce only number to string
export const coerceStrSchemaT = z.string().or(z.number()).pipe(z.coerce.string())

// Coerce only string to number
// Prevent empty string from being coerced to 0
export const coerceNumSchemaT = nonEmptyStrSchema.or(z.number()).pipe(z.coerce.number())

export const idSchema = nonEmptyStrSchema.uuid()

export const urlSchema = nonEmptyStrSchema.url()

const datetimeErrorMessage = "Timestamp must either be a string in ISO 8601 format (with UTC timezone), or an integer representing epoch time (in milliseconds)."
export const timestampSchemaT = z.union(
[
    coerceNumSchemaT.pipe(z.number().int()), // epoch time in milliseconds
    z.string().datetime({ message: datetimeErrorMessage })
]).pipe(z.coerce.date()) // coerce to Date object

const isNullish = (e) => e === undefined || e === null

// Schema used for pagination requests based on timestamps
// Either start_date or n must be provided
// end_date defaults to current time
export const timestampPaginationSchema = z.object({
    start_date: timestampSchemaT.nullish(),
    end_date: timestampSchemaT.nullish().transform(d => d ? d : new Date()), // defaults to current time
    n: coerceNumSchemaT.pipe(z.number().int().gt(0).lte(100)).nullish()
}).refine(obj => 
    (!obj.start_date) || obj.start_date < obj.end_date, {
    message: "start_date must be before end_date"
}).refine(obj => 
    !(isNullish(obj.start_date) && isNullish(obj.n)), {
    message: "either start_date or n must be provided"
})

export const activityQuerySchema = z.object({
    unit: z.enum(["minute", "hour", "day", "week", "month", "quarter", "year"]),
    start_date: timestampSchemaT.nullish(),
    end_date: timestampSchemaT.nullish().transform(d => d ? d : new Date()), // defaults to current time
}).refine(obj => 
    (!obj.start_date) || obj.start_date < obj.end_date, {
    message: "start_date must be before end_date"
})