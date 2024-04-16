# pull official base image
FROM node:19-alpine AS builder

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./

# add app
COPY . .

# build the folder
RUN npm run build

# Handle Nginx
FROM nginx:stable-alpine AS prod-stage
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 8089
CMD ["nginx", "-g", "daemon off;"]
