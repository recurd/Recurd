// postgres error codes
const ErrorCodes = {
    UNIQUE_VIOLATION: "23505",
    INVALID_TEXT_REPRESENTATION: "22P02"
}

// If errCode is null, checks if error is a DB error. 
// Otherwise checks if error is a specific DB error
function isDBError(error, errCode) {
    return error.name === "PostgresError" && (errCode ? error.code === errCode : true)
}

export {
    ErrorCodes,
    isDBError
}