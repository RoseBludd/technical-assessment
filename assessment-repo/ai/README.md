# AI Integration Task

## Objective

Create a Node.js service that uses the Anthropic Claude API to analyze customer feedback and generate appropriate responses. This demonstrates your ability to:

- Work effectively with AI APIs
- Design robust service architectures
- Implement proper error handling and rate limiting
- Document AI integration patterns

## Requirements

### 1. Feedback Analysis Service

Create a service that:

- Accepts customer feedback text via API endpoint
- Uses Claude to categorize feedback into:
  - Bug reports
  - Feature requests
  - Support inquiries
  - General feedback
- Extracts key information:
  - Sentiment
  - Priority level
  - Required action items
- Generates appropriate response templates

### 2. Prompt Engineering

- Create effective prompts that:
  - Are consistent and reusable
  - Handle edge cases
  - Extract structured data
- Document your prompt engineering approach
- Include examples of prompt iterations and improvements

### 3. Technical Requirements

- TypeScript with strict type checking
- REST API endpoints:
  - POST /analyze - Submit feedback for analysis
  - GET /categories - List available categories
  - GET /templates - List response templates
- Rate limiting and usage tracking
- Error handling and logging
- Unit and integration tests
- API documentation (OpenAPI/Swagger)

### 4. Infrastructure

- Dockerfile for containerization
- Environment variable configuration
- Logging and monitoring setup
- Performance optimization

## Sample Data

```json
{
  "feedbackSamples": [
    {
      "text": "The new dashboard is great, but it's really slow to load sometimes. Could you add a loading indicator?",
      "expectedCategory": "feature_request",
      "expectedPriority": "medium"
    },
    {
      "text": "Login is completely broken after the latest update. This is urgent!",
      "expectedCategory": "bug_report",
      "expectedPriority": "high"
    }
  ]
}
```

## Evaluation Criteria

### AI Integration (40%)

- Effective use of Claude API
- Quality of prompt engineering
- Handling of rate limits and errors
- Documentation of AI decisions

### Code Quality (30%)

- Clean, maintainable code
- Type safety
- Error handling
- Testing coverage

### Architecture (30%)

- Service design
- API design
- Performance considerations
- Documentation

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment:

```bash
cp .env.example .env
# Add your Anthropic API key
```

3. Run tests:

```bash
npm test
```

4. Start development server:

```bash
npm run dev
```

## Tips

- Start with simple prompts and iterate
- Document your prompt engineering process
- Include examples of both successful and failed attempts
- Consider edge cases and error scenarios
- Focus on reliability and maintainability
- Add comprehensive logging for debugging

## Submission

Ensure you have:

- [ ] Implemented all required endpoints
- [ ] Added comprehensive tests
- [ ] Documented your prompt engineering approach
- [ ] Included examples and edge cases
- [ ] Added API documentation
- [ ] Documented setup and running instructions
