Dockerized template site to use as starting point for development. Set up initially as very basic To Do App for demonstration purposes.

Docker Services:
  - Frontend: contains Svelte+Vite for developing frontend components
  - Backend: API server using Node.js/Express.js for interacting with database
  - DB: Postgres Database
  - Reverse-Proxy: Nginx reverse-proxy for routing incoming requests to either frontend or backend services

Intended for use with small sites, may want to make changes for bigger use-cases, like taking the database/nginx out of the container.

To Install on Remote Server:
  - Install docker (see Docker documentation appropriate for your server OS)
  - Clone this repo onto the server
  - Create .env file from .env.example template and fill in with necessary info before running.
  - Bring up the containers with `docker compose build && docker compose -f docker-compose.prod.yml up -d`

To Install Locally for Development:
  - Same as above but bring containers up with `docker compose build && docker compose up -d`
  - Site will be available at `http://localhost:8080`


