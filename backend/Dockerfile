# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Install psql for initialization
RUN apk add --no-cache postgresql-client

EXPOSE 3000
CMD ["npm", "run", "dev"]
