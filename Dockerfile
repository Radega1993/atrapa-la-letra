# Etapa de construcción
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# Copia de configuración personalizada de Nginx si es necesario
# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
