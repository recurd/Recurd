This is the external API wrapper for recurd. This package handles all communication between the backend, the external APIs, and the database.

- `lib` folder contains code concerning external APIs, with no concern of the backend, the database, or business logic.
- `src` folder contains code the wrap the external APIs. It selects the right external API to use, keeps the database updated, and return backend-compatible data.
  - `src/wrapper` contain the wrapper for each API