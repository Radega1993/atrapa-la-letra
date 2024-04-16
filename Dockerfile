FROM node:19-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS prod-stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration (if you have one)
COPY nginx.conf /etc/nginx/nginx.conf

# Health check command
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
