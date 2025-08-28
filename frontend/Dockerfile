# frontend/Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm install --production
COPY . .
CMD ["npm", "run", "build"]

