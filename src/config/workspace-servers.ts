import { WorkspaceConfig } from './workspace-management';

export const workspaceServers: WorkspaceConfig = {
  baseServerPath: 'C:\\Workspaces',
  maxDevelopersPerServer: 10,
  servers: [
    {
      id: 'dev-server-1',
      name: 'Development Server 1',
      ipAddress: '192.168.1.100',
      availableSlots: 5,
      status: 'active',
    }
  ],
  workspaceStructure: {
    componentsDir: 'components-needed',
    testUsersFile: 'test-users.json',
    authKeysDir: 'authentication-keys',
    readmeFile: 'README-task-details.txt',
    runEnvironmentScript: 'run-environment.ps1',
    logsDir: 'logs',
  },
}; 