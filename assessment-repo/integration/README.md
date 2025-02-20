# Integration Specialist Assessment

## Objective

Create an API Gateway service that demonstrates your system integration expertise.

## Project Overview

You'll be building an API Gateway that:

- Routes requests to microservices (provided via Docker)
- Implements authentication and authorization
- Handles rate limiting and caching
- Provides monitoring and logging

## Tasks

### 1. Gateway Implementation (40 points)

Example Gateway structure:

```typescript
// Example gateway setup
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticate, rateLimit } from "./middleware";

const app = express();

// Example route configuration
const routes = {
  "/users": "http://user-service:3001",
  "/tasks": "http://task-service:3002",
  "/notifications": "http://notification-service:3003",
};

// Implementation
```

Requirements:

- Implement request routing
- Add authentication
- Configure rate limiting
- Set up request/response transformation
- Handle service discovery
- Implement circuit breakers

### 2. Service Integration (30 points)

We provide Docker Compose with mock services:

```yaml
# docker-compose.yml provided
services:
  user-service:
    build: ./services/users
    ports:
      - "3001:3001"
  task-service:
    build: ./services/tasks
    ports:
      - "3002:3002"
  notification-service:
    build: ./services/notifications
    ports:
      - "3003:3003"
```

Requirements:

- Service health checks
- Load balancing
- Error handling
- Retry policies
- Timeout configurations
- Circuit breaker patterns

### 3. Monitoring & Documentation (30 points)

Requirements:

- Implement logging
- Add metrics collection
- Create monitoring dashboard
- Document API routes
- Performance testing
- Security testing

## Getting Started

1. Setup project:

```bash
# Start mock services
docker-compose up -d

# Install dependencies
npm install

# Start gateway
npm run dev
```

2. Available Scripts:

```bash
npm run dev        # Start gateway
npm run test      # Run tests
npm run docs      # Generate documentation
npm run metrics   # View metrics dashboard
```

3. Project Structure:

```
integration/
├── src/
│   ├── gateway/       # Gateway implementation
│   ├── middleware/    # Custom middleware
│   ├── services/      # Service definitions
│   ├── monitoring/    # Monitoring setup
│   └── utils/         # Helper functions
├── tests/           # Test files
└── docs/           # Documentation
```

## Provided Resources

- Docker Compose with mock services
- Service templates
- Test examples
- Monitoring templates
- Postman collection

## Requirements

### Technical

- Node.js
- TypeScript
- Express Gateway or similar
- Redis (for caching)
- Prometheus/Grafana
- OpenAPI/Swagger

### Features

- Request routing
- Authentication
- Rate limiting
- Circuit breaking
- Load balancing
- Service discovery

### Testing

- Integration tests
- Load tests
- Chaos testing
- Security tests

## Evaluation Criteria

### Gateway Design (30%)

- Routing logic
- Middleware implementation
- Error handling
- Security measures

### Service Integration (30%)

- Service discovery
- Load balancing
- Circuit breaking
- Error handling

### Monitoring (20%)

- Logging
- Metrics
- Alerting
- Dashboard

### Documentation (20%)

- API documentation
- Setup instructions
- Architecture diagrams
- Troubleshooting guides

## Tips

- Start with basic routing
- Use provided services
- Focus on reliability
- Document thoroughly
- Consider edge cases
- Test failure scenarios

## Submission Checklist

- [ ] Gateway implemented
- [ ] Services integrated
- [ ] Monitoring setup
- [ ] Documentation complete
- [ ] Tests passing
- [ ] Security measures in place
- [ ] Performance tested

## Notes

- All services run locally in Docker
- No cloud services needed
- Mock services provided
- Focus on integration patterns
- Document design decisions
