# fuel-example

This project shows how one can index Fuel network using Subsquid SDK.

## Getting started

### Prerequisites

- Node.js (version 20.x and above)
- Docker

### Run indexer

```bash
# Install dependencies
npm ci

# Compile the project
sqd build

# Launch Postgres database to store the data
sqd up

# Apply database migrations to create the target schema
sqd migration:generate

# Run indexer
sqd process

# Shut down the database
sqd down

# In another terminal, launch the server
sqd serve
#open http://localhost:4000/graphql
```

Visit the documentation page for more details on using subsquid for Fuel.
