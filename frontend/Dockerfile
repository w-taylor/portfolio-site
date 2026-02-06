# frontend/Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

FROM base AS development
COPY package*.json ./
RUN npm install
CMD ["npm", "run", "dev"]

FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
