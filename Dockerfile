# Use official Node.js 18 as base image
FROM --platform=$BUILDPLATFORM node:18 AS build

# Update OS packages to patch known vulnerabilities (Debian-based image → apt-get, not apk)
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Set environment variable
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the client code
COPY . .

# Build the client for production
RUN npm run build


FROM --platform=$BUILDPLATFORM nginx:alpine
# Upgrade libexpat to patched version (fixes CVE-2026-45186)
RUN apk upgrade --no-cache libexpat
# Copy the build artifacts from the build stage
COPY --from=build /app/dist /usr/share/nginx/html
# NGINX default configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]