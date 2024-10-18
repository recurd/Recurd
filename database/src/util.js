// Removes undefined or null values from object
// For schema validation, use 'schema.transform(removeNullish)'
// Some columns are NOT NULL and have DEFAULT value set.
// If one inserts with a null or undefined, Postgres throws an error
// Calling this function on the inserted object prevents that
export function removeNullish(obj) {
    if (typeof obj !== 'object') return
    Object.keys(obj).forEach(key => (obj[key] === undefined || obj[key] === null) && delete obj[key])
    return obj // in case return value is needed
}