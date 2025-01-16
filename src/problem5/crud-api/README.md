## Quick Start
Install the dependencies:

```bash
yarn install
```
## Commands

Database initialization:

```bash
# init db
yarn db:init

# sync changes to db
yarn db:migrate

# seed db data
yarn db:seed

# start prisma studio
yarn db:studio
```

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn build
yarn start
```

Testing:

```bash
# run all tests
yarn test
```


## Features
- Provide CRUD api for User and Order resources as well as Authentication method
- Passport JWT
- Role-based user authorization
- Search, pagination, filter
- Swagger API

## Enhancement
- Enhance full-text search functionality.
- Create searchIndex field, combining multiple fields to be searching.
- Search, pagination, filter
- Swagger API

- **SQL database**

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000

# URL of the database
DATABASE_URL=

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/api` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).
