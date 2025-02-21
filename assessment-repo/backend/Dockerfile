# Base stage for both development and production
FROM node:18-alpine as base

WORKDIR /usr/src/app

# Development stage
FROM base as development

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Production stage
FROM base as production

COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

COPY . .
RUN npm run build

# Remove source code and build dependencies
RUN rm -rf src/ && \
    rm -rf node_modules/ && \
    npm ci --only=production --legacy-peer-deps

EXPOSE 3333

CMD ["npm", "start"] 