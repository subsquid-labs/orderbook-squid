# fuel-example

This project shows how one can index Fuel network using Subsquid SDK.

## Getting started

### Prerequisites

* Node.js (version 20.x and above)
* Docker
* `sqd` [CLI tool](https://docs.subsquid.io/squid-cli/installation/)

### Run indexer

```bash
# Install dependencies
npm ci

# Compile the project
sqd build

# Launch Postgres database to store the data
sqd up

# Generate database migrations to create the target schema
sqd migration:generate

# Run indexer
sqd process

# Checkout indexed swaps
docker exec "$(basename "$(pwd)")-db-1" psql -U postgres \
  -c "SELECT id, logs_count, found_at FROM contract ORDER BY logs_count desc LIMIT 10"

# Start graphQL server 
sqd serve
```

For further details please consult heavily commented [main.ts](./src/main.ts).
