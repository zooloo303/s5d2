# create-a-d2app-with-svelte

Everything you need to build a Destiny 2 Companion app using Svelte 5, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating your project

clone this repo and run `npm install` to install the dependencies.

```bash
# to install the dependencies.
npm install

# create a self-signed SSL certificate for the https dev server, it's easy, google it!
# place the .pem files in the folder ABOVE root (default setting) or configure in vite.config.ts

# create a .env file in the root and add the following:
BUNGIE_API_KEY=""
BUNGIE_CLIENT_ID=""
BUNGIE_CLIENT_SECRET=""
## Developing
# start the server and open the app in a new browser tab
npm run dev -- --open
```
