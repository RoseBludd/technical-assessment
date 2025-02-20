FROM node:18-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache postgresql-client python3 make g++ libc6-compat

# Install TypeScript globally
RUN npm install -g typescript

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Rebuild argon2 for Alpine
RUN npm rebuild argon2 --build-from-source

# Copy configuration files
COPY tsconfig.json .

# Copy source code
COPY src ./src
COPY scripts ./scripts

# Build TypeScript code
RUN npm run build && ls -la dist/

# Remove build dependencies
RUN apk del python3 make g++

EXPOSE 3000

CMD ["node", "scripts/start.js"] 