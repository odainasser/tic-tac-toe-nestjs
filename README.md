## Description

This project is a Tic-Tac-Toe game built using the NestJS framework. It includes features such as user authentication, game management, real-time updates using WebSockets, user token caching by Redis and unit test.

## Installation

```bash
$ npm install --legacy-peer-deps
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database Migrations

```bash
# run migrations
$ npm run migration:run

# revert migrations
$ npm run migration:revert
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Running the Socket.io Client

```bash
$ npx ts-node src/client/game-client.ts
```

