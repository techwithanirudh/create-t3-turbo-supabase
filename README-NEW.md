# T3 Turbo x Supabase - Development Guide

This guide explains how to get started with T3 Turbo x Supabase and how to properly develop with it in a production environment.

## Prerequisites

You only need to install:

- Node.js >=20.12.0
- pnpm 9.2.0 or higher
- Homebrew (for macOS)

The setup script will handle installing:

- Supabase CLI
- Vercel CLI
- Other required dependencies

## Initial Setup

### 1. Account Setup

Before running the setup script, you need to:

1. Create a Supabase account at [app.supabase.com](https://app.supabase.com)
2. Create an organization in Supabase
3. Have your Supabase organization ID ready (found in organization settings)
4. Have a Vercel account (you'll be prompted to log in during setup)

### 2. Automated Setup

Run the setup script:

```bash
./setup-project.sh
```

The script automatically:

1. Installs all required CLIs and dependencies
2. Creates a new Supabase project
3. Configures Supabase authentication and security:
   - Sets up auth triggers
   - Configures database schema
   - Sets up security policies
4. Creates a Vercel project
5. Sets up all environment variables
6. Deploys the initial version

You don't need to manually:

- Create database tables
- Set up auth triggers
- Configure security policies
- Set up environment variables
- Initialize the project structure

### 3. Start Development

Once the script completes, simply run:

```bash
pnpm dev
```

This starts both the Next.js and Expo development servers.

## Development Workflow

### Local Development with Supabase

For local development, we recommend using Supabase local development:

1. Start local Supabase:

   ```bash
   supabase start
   ```

   This creates a local Docker container with your Supabase stack.

2. Development Database Migrations:

   ```bash
   # When making schema changes:
   pnpm db:generate  # Creates a new migration
   pnpm db:migrate   # Applies migration locally
   ```

3. Testing Migrations:
   - Always test migrations locally first
   - Use a staging environment before production
   - Never directly modify production schema

### Production Database Workflow

Follow this workflow for production database changes:

1. Create Feature Branch:

   ```bash
   git checkout -b feature/db-change
   ```

2. Make Schema Changes:

   - Modify schema in `packages/db/schema/`
   - Generate migration
   - Test locally

3. Review Process:

   - Push changes
   - Create PR
   - Review migration files carefully
   - Test in staging environment

4. Production Deployment:
   - Migrations run automatically during deployment
   - Monitor migration logs
   - Have rollback plan ready

### Backend Development (tRPC)

The backend is structured around tRPC routers in `packages/api/src/router/`:

1. Creating New Endpoints:

   - Add routes to appropriate router file
   - Use Zod for input validation
   - Implement proper error handling
   - Add proper typing

2. Database Queries:
   - Use Drizzle query builder
   - Implement proper transactions
   - Consider query performance
   - Add appropriate indexes

### Frontend Development

The project supports both web (Next.js) and mobile (Expo) development:

1. Shared Code:

   - Common components in `packages/ui`
   - Shared types in `packages/api`
   - Reusable utilities in appropriate packages

2. Web Development (Next.js):

   - Located in `apps/nextjs`
   - Uses tRPC for API calls
   - Implements Supabase auth

3. Mobile Development (Expo):
   - Located in `apps/expo`
   - Uses same tRPC backend
   - Has platform-specific auth handling

## Production Considerations

### Database Management

- Never make direct production database changes
- Always use migrations for schema changes
- Backup database before migrations
- Monitor query performance
- Use appropriate indexes

### Security

- Rotate API keys regularly
- Review security policies
- Monitor auth logs
- Keep dependencies updated

### Performance

- Monitor API response times
- Optimize database queries
- Use appropriate caching
- Monitor resource usage

### Deployment

- Use staging environment
- Test migrations thoroughly
- Monitor deployment logs
- Have rollback procedures
- Use proper CI/CD

## Troubleshooting

### Common Issues

1. Database Connection:

   - Check Supabase status
   - Verify network access
   - Check connection strings

2. Auth Issues:

   - Verify JWT configuration
   - Check auth provider setup
   - Review auth logs

3. Development Environment:
   - Clear turbo cache
   - Restart development servers
   - Check for dependency conflicts

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [T3 Stack Documentation](https://create.t3.gg)
- [tRPC Documentation](https://trpc.io)
- [Drizzle Documentation](https://orm.drizzle.team)

## Next Steps

The setup script has handled the complex configuration. You can now:

1. Start development with `pnpm dev`
2. Create new features
3. Add precommit hooks (coming soon)
4. Set up CI/CD pipelines
5. Configure monitoring and logging

Remember to:

- Follow the migration workflow
- Test thoroughly
- Review security regularly
- Monitor performance
- Keep dependencies updated
