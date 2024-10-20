This is the external API wrapper for recurd. This package handles all communication between the backend, the external APIs, and the database.

- The only exported code lives in `index.ts`. The two functions, `connectService` and `findService`, uses the right `ServiceBuilder` based on the specified service type.
- `src/api` folder contains code concerning external APIs, with no concern of the backend, the database, or business logic.
- `src/formatter` is takes care of transforming the input from the external api to a format that is compatible with inserting into the database.
- `src/services` contain the wrapper code for each API. This includes handling syncing information with the database, using the formatter to transform the input from the API, and keeping the user authenticated with the service. Each api corresponds to a service builder and a service.
  - `ServiceBuilder` handles 
    - Connecting the user to the external service (for auth2.0, this means fetching the access token) if the user was never connected
    - Fetching the user's service info from the DB, if the user has connected before
  - `Service` handles everything else (for auth2.0, the automatic, lazy request for refresh tokens). Currently, two features are supported:
    - Getting user's currently listening track
    - Getting user's recent listens