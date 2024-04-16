# Use an official Node runtime as a parent image
FROM node:19-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the React application
RUN npm run build

# Use nginx alpine image for the production stage
FROM nginx:stable-alpine AS prod-stage

# Copy the build directory from the builder stage to the nginx serve directory
COPY --from=builder /app/build /usr/share/nginx/html

# Inform Docker that the container listens on the specified network port at runtime.
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
