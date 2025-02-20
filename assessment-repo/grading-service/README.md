# Assessment Grading Service

This service automatically grades candidate submissions via GitHub pull requests.

## Setup

1. Install dependencies:

```powershell
./scripts/setup.ps1
```

2. Configure environment variables:

```env
# .env
DATABASE_URL="your_postgres_url"
ANTHROPIC_API_KEY="your_api_key"
GITHUB_WEBHOOK_SECRET="your_webhook_secret"
PORT=3000
```

3. Set up GitHub webhook:
   - Go to your repository settings
   - Add webhook: `http://your-server/api/webhook/github`
   - Content type: `application/json`
   - Secret: Use the same as `GITHUB_WEBHOOK_SECRET`
   - Events: Select "Pull requests"

## Usage

1. Start the service:

```powershell
npm run dev
```

2. Access admin dashboard:
   - Local: `http://localhost:3000/admin`
   - View submissions and results

## Submission Flow

1. Candidate submits PR:

   - Branch format: `assessment/<role>/<name>`
   - Example: `assessment/frontend/john-doe`

2. Service automatically:

   - Verifies candidate email matches application
   - Runs role-specific tests
   - Performs AI code review
   - Updates PR with results

3. Results stored in database:
   - Test results
   - AI feedback
   - Final score
   - Pass/fail status

## API Endpoints

### GitHub Webhook

- POST `/api/webhook/github`
  - Handles PR submissions
  - Triggers grading process

### Admin API

- GET `/api/admin/submissions`
  - List all submissions
- GET `/api/admin/submissions/:id`
  - Get specific submission details

## Development

- Update test runners in `src/test-runners/`
- Modify grading logic in `src/index.ts`
- Add new role support in schema and code

## Notes

- Ensure candidate's GitHub email matches their application email
- Test results and AI feedback stored as JSON
- Passing score is 70%
