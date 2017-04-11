## Quick start

First install a new Node.js (6.x) if you don't have it already.

```
git clone git@github.com:calmm-js/karet-express-boilerplate.git
cd karet-express-boilerplate
npm install
npm run watch
```

Then:

```
open http://localhost:3000
```

## With DB

For full experience you will also need a DB.  An easy way to get a DB running
for development is to use Docker.

There is a `docker-compose.yml` file that specifies a suitable PostgreSQL image.
To start the DB, simply run

```
docker-compose up
```

in a new shell.  The Node server uses a DB to store results if the following
variables are set:

```
export DATABASE_URL='postgres://keb:keb@dockerhost:5432/keb'
```

Check that the hostname (above `dockerhost`) matches your configuration.
