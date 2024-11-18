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

// Used for locking, produces 53-bit ints
export function hashString(str, seed = 0) {
    // See https://stackoverflow.com/a/52171480/12882118
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i)
        h1 = Math.imul(h1 ^ ch, 2654435761)
        h2 = Math.imul(h2 ^ ch, 1597334677)
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

    return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}