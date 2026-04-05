# Listless

Listless is an end-to-end encrypted list app with protected access and no logins.

## Motivation

I want to have a shared grocery list for my household, but shockingly neither Apple Reminders nor Microsoft Todo
would actually synchronize properly across devices. Some other options I found included obnoxious advertisements
or questionable data practices.

So, like any good Software Engineer, I made an app myself!

## High level implementation details

1. Lists support end-to-end encryption on the client-side using AES-GCM encryption.
2. Lists may be 'protected' against unauthorized mutations. Clients must provide a valid ED25519 signature for their requests.
3. Clients share encryption and mutation keys among themselves using the hash part of a share URL.
4. Clients store list information using their browser's localStorage.

## DISCLAIMER

As maintained by [terms.tsx](./src/routes/terms.tsx). You should audit the code to determine suitability for your 
purposes.

## Development

### SolidStart

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

#### Docker

From the project root.

```sh
docker build -t listless .
```

The resulting image will expose an http server on port `3000`. Be sure to provide the `LISTLESS_DB_FILENAME` environment
variable so the database may be persisted. 

E.g., mount `-v /path/on/host:/listless/db` into the container and set `-e LISTLESS_DB_FILENAME="/listless/db/sqlite.sb"`
