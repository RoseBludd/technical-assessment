# Base Components Integration Guide

## Core Components Overview

### 1. Header Components

- **Notifications System**

  - Location: Top header bar
  - Features:
    - Unread count badge
    - Notification categories (lead, calendar, task)
    - Mark as read functionality
    - Click routing to relevant pages
  - Integration Points:

    ```typescript
    // Subscribe to notifications
    notificationService.subscribe((notifications) => {
      // Handle updated notifications
    });

    // Mark as read
    notificationService.markAsRead(notificationId);

    // Mark all as read
    notificationService.markAllAsRead();
    ```

### 2. Internal Messaging

- **Message System**
  - Features:
    - Department-wide messaging
    - Direct messaging
    - Priority levels (normal, high, urgent)
    - Real-time updates
  - Integration Requirements:
    - User context (userId, userName)
    - Department context
    - Message threading
    - Notification integration

### 3. Navigation Structure

- **Side Navigation**
  - Features:
    - Collapsible sidebar (64px collapsed, 240px expanded)
    - Department-specific navigation items
    - Role-based visibility
    - Persistent state
  - Integration Points:
    ```typescript
    // Department Navigation Configuration
    {
      id: "department-section",
      items: [
        {
          name: "Section Name",
          href: "/department/section",
          icon: "icon-name",
          scope: "department-name"
        }
      ]
    }
    ```

### 4. Department Grid Layout

- **Root Page Grid**
  - Features:
    - Department access cards
    - Quick action buttons
    - Status indicators
    - Preview images
  - Integration Requirements:
    - Department metadata
    - Access control
    - Preview generation
    - Status tracking

## Integration Guidelines

### 1. Department Page Setup

```typescript
import { Layout } from '@/components/layout/Layout';
import { Department } from '@/config/departments';

export default function DepartmentPage() {
  return (
    <Layout
      title="Department Name"
      department={Department.DEPARTMENT_NAME}
    >
      {/* Department content */}
    </Layout>
  );
}
```

### 2. Navigation Integration

1. Add department routes to `src/config/routing.json`
2. Define department navigation in `src/config/navigation.ts`
3. Set up role-based access in `src/config/departments.ts`

### 3. Notification Integration

1. Register department notification types
2. Set up notification handlers
3. Configure routing for notification actions

### 4. Messaging Integration

1. Set up department message handlers
2. Configure message routing
3. Implement priority handling

## Best Practices

### 1. Component Consistency

- Use existing UI components when available
- Maintain consistent styling
- Follow established patterns for interactions

### 2. State Management

- Use appropriate context providers
- Maintain consistent data flow
- Handle loading and error states

### 3. Performance

- Implement proper subscription cleanup
- Use appropriate caching strategies
- Optimize re-renders

### 4. Security

- Validate user permissions
- Sanitize user inputs
- Follow established security patterns

## Department Grid Integration

### 1. Grid Item Structure

```typescript
interface DepartmentGridItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  previewImage?: string;
  features: {
    title: string;
    description: string;
    prerequisitePages?: string[];
  }[];
  access: {
    roles: string[];
    permissions: string[];
  };
}
```

### 2. Feature Preview

- Include representative screenshots
- List key functionality
- Show access requirements
- Display related workflows

### 3. Access Control

- Role-based visibility
- Permission-based actions
- Audit logging
- Status tracking

## Testing Requirements

### 1. Component Testing

- Test integration with base components
- Verify notification handling
- Validate message routing
- Check navigation state

### 2. Integration Testing

- Test cross-component communication
- Verify data flow
- Validate state management
- Check error handling

### 3. End-to-End Testing

- Test complete workflows
- Verify navigation paths
- Validate user interactions
- Check data persistence

## Documentation Requirements

### 1. Component Documentation

- Document integration points
- List required props
- Explain state management
- Provide usage examples

### 2. API Documentation

- Document endpoints
- List request/response formats
- Explain error handling
- Provide authentication requirements

### 3. Workflow Documentation

- Document user flows
- Explain integration points
- List dependencies
- Provide troubleshooting guides
