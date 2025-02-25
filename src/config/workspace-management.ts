import { z } from 'zod';

// Workspace Configuration Schema
export const WorkspaceConfigSchema = z.object({
  baseServerPath: z.string(),
  maxDevelopersPerServer: z.number(),
  servers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    ipAddress: z.string(),
    availableSlots: z.number(),
    status: z.enum(['active', 'maintenance', 'full']),
  })),
  workspaceStructure: z.object({
    componentsDir: z.string().default('components-needed'),
    testUsersFile: z.string().default('test-users.json'),
    authKeysDir: z.string().default('authentication-keys'),
    readmeFile: z.string().default('README-task-details.txt'),
    runEnvironmentScript: z.string().default('run-environment.ps1'),
    logsDir: z.string().default('logs'),
  }),
});

export type WorkspaceConfig = z.infer<typeof WorkspaceConfigSchema>;

// Developer Session Schema
export const DeveloperSessionSchema = z.object({
  developerId: z.string(),
  serverId: z.string(),
  workspaceId: z.string(),
  taskId: z.string(),
  vpnInstalled: z.boolean(),
  lastAccess: z.date(),
  status: z.enum(['active', 'inactive', 'disconnected']),
});

export type DeveloperSession = z.infer<typeof DeveloperSessionSchema>;

// Default Configuration
export const defaultWorkspaceConfig: WorkspaceConfig = {
  baseServerPath: '/server',
  maxDevelopersPerServer: 10,
  servers: [],  // To be populated from environment/database
  workspaceStructure: {
    componentsDir: 'components-needed',
    testUsersFile: 'test-users.json',
    authKeysDir: 'authentication-keys',
    readmeFile: 'README-task-details.txt',
    runEnvironmentScript: 'run-environment.ps1',
    logsDir: 'logs',
  },
};

// Workspace Status Enum
export enum WorkspaceStatus {
  CREATING = 'creating',
  READY = 'ready',
  IN_USE = 'in_use',
  ERROR = 'error',
  ARCHIVED = 'archived',
}

// Access Control Level Enum
export enum AccessLevel {
  READ = 'read',
  WRITE = 'write',
  EXECUTE = 'execute',
  ADMIN = 'admin',
} 