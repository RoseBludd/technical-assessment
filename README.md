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

## Database Migrations

Database changes are managed through SQL migration files in the `migrations/` directory. Each migration is tracked in the `CHANGELOG.md` file.

### Prerequisites
- PostgreSQL client (`psql`) installed and available in your PATH
- Access to the Neon database (DATABASE_URL in .env file)

### Applying Migrations
1. Ensure your `.env` file contains the correct `DATABASE_URL`
2. Navigate to the migrations directory:
   ```powershell
   cd migrations
   ```
3. Run the migration script:
   ```powershell
   .\apply_migration.ps1
   ```

### Creating New Migrations
1. Create a new SQL file in the `migrations/` directory with a descriptive name
2. Add the SQL commands for your database changes
3. Update the `CHANGELOG.md` file with details about your changes
4. Test the migration locally before applying to production

# Workspace Environment Setup

This package provides everything needed to connect to development workspaces.

## One-Click Installation

1. Right-click `scripts/setup-workspace-environment.ps1` and select "Run with PowerShell as Administrator"
2. Wait for the installation to complete

## What Gets Installed

- OpenVPN (if not already installed)
- Workspace connection protocol handler
- VPN configuration
- RDP certificate trust settings

## Manual Installation Steps (if needed)

1. Install OpenVPN from https://openvpn.net/community-downloads/
2. Copy the VPN configuration from `config/base.ovpn` to your OpenVPN config directory
3. Run `scripts/setup-workspace-environment.ps1` to configure the protocol handler

## Usage

Once installed, simply click the "Connect to Workspace" button in the application. This will:

1. Start OpenVPN if not running
2. Connect to the VPN
3. Launch Remote Desktop with the correct settings
4. Connect you to an available workspace

## Troubleshooting

1. If the connection fails:
   - Check that OpenVPN is installed and running
   - Ensure you're logged into the application
   - Try disconnecting and reconnecting to the VPN

2. If you can't connect to RDP:
   - Wait a few seconds after the VPN connects
   - Check that you have network connectivity
   - Try restarting the OpenVPN service

## Security Notes

- Your workspace credentials are managed securely by the application
- All connections are encrypted using OpenVPN
- RDP uses standard Windows security
