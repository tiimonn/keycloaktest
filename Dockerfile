# 1. Define the build stage
FROM node:18-alpine as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the project files into the container
COPY . .

# Define build arguments for Vite environment variables
ARG VITE_AUTH_URL
ARG VITE_AUTH_CLIENT
ARG VITE_AUTH_REALM

# Set the environment variables for the build stage
ENV VITE_AUTH_URL=${VITE_AUTH_URL}
ENV VITE_AUTH_CLIENT=${VITE_AUTH_CLIENT}
ENV VITE_AUTH_REALM=${VITE_AUTH_REALM}
ENV VITE_AUTH_REDIRECT_URL=${VITE_AUTH_REDIRECT_URL}

# RUN echo "VITE_AUTH_URL=${VITE_AUTH_URL}\n" > .env.production
# RUN echo "VITE_AUTH_CLIENT=${VITE_AUTH_CLIENT}\n" > .env.production
# RUN echo "VITE_AUTH_REALM=${VITE_AUTH_REALM}\n" > .env.production
# RUN echo "VITE_AUTH_REALM=${VITE_AUTH_REALM}\n" > .env.production

# Build the app
RUN npm run build

# 2. Define the production stage and use Nginx to serve the built app
FROM nginx:stable-alpine as production-stage

# Set the working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=build-stage /app/dist .

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
