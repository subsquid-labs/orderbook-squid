# fuel-example

This project shows how one can index Fuel network using Subsquid SDK.

## Getting started

### Prerequisites

* Node.js (version 20.x and above)
* Docker

### Run indexer

```bash
# Install dependencies
npm ci

# Compile the project
npx tsc

# Launch Postgres database to store the data
docker compose up -d

# Apply database migrations to create the target schema
npx squid-typeorm-migration apply

# Run indexer
node -r dotenv/config lib/main.js

# Checkout indexed swaps
docker exec "$(basename "$(pwd)")-db-1" psql -U postgres \
  -c "SELECT id, logs_count, found_at FROM contract ORDER BY logs_count desc LIMIT 10"
```

For further details please consult heavily commented [main.ts](./src/main.ts).
