# Developer Portal - Task Pool

A modern task management system for developers, built with Next.js, Prisma, and TypeScript.

## Quick Start

1. Clone the repository:

```powershell
git clone https://github.com/yourusername/dev-portal.git
cd dev-portal
```

2. Run the setup script:

```powershell
./scripts/setup.ps1
```

That's it! The setup script will:

- Install pnpm if not already installed
- Install all dependencies
- Set up the database automatically
- Build the project

3. Start the development server:

```powershell
pnpm dev
```

## Features

- Task filtering by department, complexity, and category
- Detailed task cards with complexity indicators
- Real-time updates
- Modern dark theme UI
- Responsive design

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   └── tasks/       # Task-related components
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript types
│   └── styles/          # Global styles
├── prisma/              # Database schema and migrations
├── scripts/            # Setup and utility scripts
├── public/             # Static assets
└── tests/              # Test files
```

## Database Setup

The project uses PostgreSQL with Prisma ORM. The default connection string in `.env` is:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dev_portal"
```

The setup script will automatically:

1. Create the database if it doesn't exist
2. Set up all required tables
3. Apply any pending migrations
4. Seed initial data if available

You just need to make sure PostgreSQL is installed and running with the default credentials (username: postgres, password: postgres).

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm lint` - Run linting
- `pnpm prisma:studio` - Open Prisma Studio

## Environment Variables

All environment variables are included in the `.env` file. For this private repository, we keep the environment files committed for easy setup.

## Troubleshooting

1. If you get database connection errors:

   - Make sure PostgreSQL is running
   - Verify your PostgreSQL username and password match the `.env` file (default: postgres/postgres)
   - If using different credentials, update the DATABASE_URL in `.env`

2. If you get port conflicts:
   - The default port is 3000
   - You can change it by running `pnpm dev -p [port-number]`

## License

MIT License - see LICENSE file for details
