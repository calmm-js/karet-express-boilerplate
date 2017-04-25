[![Gitter](https://img.shields.io/gitter/room/calmm-js/chat.js.svg)](https://gitter.im/calmm-js/chat)
[![Build Status](https://travis-ci.org/calmm-js/karet-express-boilerplate.svg?branch=master)](https://travis-ci.org/calmm-js/karet-express-boilerplate)
[![](https://david-dm.org/calmm-js/karet-express-boilerplate.svg)](https://david-dm.org/calmm-js/karet-express-boilerplate)
[![](https://david-dm.org/calmm-js/karet-express-boilerplate/dev-status.svg)](https://david-dm.org/calmm-js/karet-express-boilerplate?type=dev)

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

## Windows

If you are working on Windows, then you should know that the NPM scripts in
the [`package.json`](./package.json#L7) are designed to run with Bash.  If you
cannot have Bash shell installed for some reason, then you need to port those
scripts to CMD or something else.  Note that this project is just a sample.  You
will always want to customize the scripts for your particular needs.

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
