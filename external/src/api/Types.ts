export class APIError extends Error {}

// Indicating that fetch failed with the following response object
export class FetchError extends APIError {
    response: Response

    constructor(response: Response, message?: string) {
        let msg = `${response.url} ${response.status} ${response.statusText} - `
        if (message) msg += message
        super(message)
        this.response = response
    }

    async getBody(): Promise<object | string> {
        const body = await this.response.text()
        try {
            return JSON.parse(body)
        } catch (e) {
            return body
        }
    }
}

// Indicating that refreshing token failed, should retry
export class RefreshError extends FetchError {}