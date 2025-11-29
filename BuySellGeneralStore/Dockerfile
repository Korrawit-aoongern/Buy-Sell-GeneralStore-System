###
# Multi-stage Dockerfile for Nuxt 4 app
# - builder stage: installs dependencies and builds the Nuxt app
# - runner stage: small runtime image that runs the compiled output
###

FROM node:20-bullseye-slim AS builder
WORKDIR /app

# copy package manifest first, install dependencies (leverage Docker cache)
COPY package.json package-lock.json* ./

# Install dependencies (include devDependencies for the build)
RUN npm ci --ignore-scripts --prefer-offline || npm install

# copy source and build
COPY . .

# run prepare and build
RUN npm run build


FROM node:20-bullseye-slim AS runner
WORKDIR /app

# Only copy the build output (server) and production node_modules
COPY --from=builder /app/.output .output
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

# Expose default Nuxt port
EXPOSE 3000

# Start the app by running the generated server entrypoint
CMD ["node", ".output/server/index.mjs"]
