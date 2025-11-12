FROM nginx:alpine AS production

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom main config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy server configurations
COPY conf.d/ /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]
