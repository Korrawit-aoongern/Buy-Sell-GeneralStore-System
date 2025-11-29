# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Docker / Container usage 🚀

This repository includes a production-ready Dockerfile and a docker-compose.yml for convenient development and deployment.

Build an image locally and run it:

```powershell
# build (from project root: BuySellGeneralStore)
docker build -t buy-sell-generalstore:latest .

# run
docker run -p 3000:3000 --env NUXT_PUBLIC_SUPABASE_URL="your_url_here" --env NUXT_PUBLIC_SUPABASE_ANON_KEY="your_key_here" buy-sell-generalstore:latest
```

Use docker-compose for development or built containers:

```powershell
# run in development mode (hot-reload; the dev service will install dependencies into a named volume on first run)
docker compose up dev

# build & run production service from Dockerfile
docker compose up --build app

# stop and remove containers
docker compose down
```

- The app listens on port 3000 by default. If you rely on environment variables (e.g. Supabase keys), keep them out of the repo and pass them to the container via environment variables or an external .env file.
- If you need a smaller runtime image, you can change the `runner` stage in the Dockerfile to use a smaller base image or copy only production dependencies into the final image.
- The dev container will create and reuse a named volume for `/app/node_modules` to avoid overwriting host dependencies and speed up reproducible container dev. The first time you start `docker compose up dev` the container will run `npm install` inside the container (if node_modules is missing) and then start Nuxt.

- The app listens on port 3000 by default. If you rely on environment variables (e.g. Supabase keys), keep them out of the repo and pass them to the container via environment variables or an external .env file.
- If you need a smaller runtime image, you can change the `runner` stage in the Dockerfile to use a smaller base image or copy only production dependencies into the final image.

