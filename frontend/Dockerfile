# frontend/Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

FROM base AS production  
RUN npm ci --production
COPY --from=builder /app/build ./build
CMD ["node", "build/index.js"]
