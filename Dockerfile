# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.22.0

################################################################################
# Create a stage for installing dependencies and building
FROM node:${NODE_VERSION} as build
WORKDIR /geojournal

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

ARG MONGODB_URI
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG IMAGEKIT_PRIVATE_KEY
ARG IMAGEKIT_PUBLIC_KEY
ARG AUTH_TRUST_HOST

ENV MONGODB_URI=${MONGODB_URI}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV IMAGEKIT_PRIVATE_KEY=${IMAGEKIT_PRIVATE_KEY}
ENV IMAGEKIT_PUBLIC_KEY=${IMAGEKIT_PUBLIC_KEY}
ENV NEXTAUTH_TRUST_HOST=${NEXTAUTH_TRUST_HOST}

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM node:${NODE_VERSION}-slim as final
WORKDIR /geojournal

# Use production node environment by default.
ENV NODE_ENV production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy production assets
COPY --from=build --chown=node:node /geojournal/public ./public

# Copy the built application from the build stage into the image.
COPY --from=build --chown=node:node /geojournal/.next/standalone ./
COPY --from=build --chown=node:node /geojournal/.next/static ./.next/static

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["node", "server.js"]
