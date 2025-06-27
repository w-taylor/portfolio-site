# Build stage (install everything)
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Install ALL deps (including devDependencies) if `--build-arg DEV_MODE=true`
ARG DEV_MODE=false
RUN if [ "$DEV_MODE" = "true" ]; then npm ci; \
    else npm ci --production; fi

COPY . .

# Final stage (production)
FROM base AS production
CMD ["npm", "start"]

# Dev stage (extends base)
FROM base AS development
CMD ["npm", "run", "dev"]
