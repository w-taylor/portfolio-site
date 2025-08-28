FROM nginx:alpine AS production
# Remove default nginx files first
RUN rm -rf /usr/share/nginx/html/*
# Then copy your built files
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
