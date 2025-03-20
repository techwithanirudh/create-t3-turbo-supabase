# T3 Turbo x Supabase

A full-stack, typesafe starter monorepo with Next.js, React Native, and Supabase, featuring:

- 🏎 Turborepo
- 🚀 Next.js (web) + Expo (mobile)
- 🔐 Supabase Auth
- 🎨 Tailwind CSS
- 💻 TypeScript
- 📱 React Native
- 🧰 Turbo Generators
- 🗄️ Drizzle ORM

## Database Architecture

This project uses Supabase for the database with Drizzle ORM for type-safe database operations. The database layer is managed through local migrations using Drizzle, providing:

- Type-safe schema definitions
- Version-controlled migrations
- Local development workflow
- Safe production deployments

### Schema Structure

```typescript
// packages/db/src/schema/profile.ts
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { users } from "./auth";

export const profile = pgTable("t3turbo_profile", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 256 }).notNull(),
  image: varchar("image", { length: 256 }),
  email: varchar("email", { length: 256 }),
});

// packages/db/src/schema/post.ts
export const post = pgTable("t3turbo_post", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => profile.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});
```

## Quick Start

### 1. Run the Setup Script

```bash
./setup-project.sh
```

The setup script automates the following:

1. **Environment Setup**

   - Creates `.env` file with all necessary variables
   - Installs required tools (Homebrew, Node.js, pnpm, Supabase CLI, Vercel CLI)

2. **Project Initialization**

   - Clones the repository
   - Sets up a new Git repository
   - Creates and pushes to a new GitHub repository

3. **Vercel Configuration**

   - Links project to Vercel
   - Sets up project configuration (root directory, framework, build commands)
   - Configures environment variables

4. **Supabase Setup**

   - Creates a new Supabase project
   - Configures auth settings
   - Sets up database connection
   - Links project locally

5. **Environment Configuration**

   - Pulls environment variables from Vercel
   - Sets up all necessary API keys and connection strings
   - Configures both development and production environments

6. **Initial Deployment**
   - Deploys the application to Vercel
   - Sets up continuous deployment from GitHub

### 2. Post-Setup Configuration

After running the setup script, you'll need to:

1. **Configure Supabase Auth**

   - Go to your Supabase dashboard -> Auth -> Providers
   - Set up desired auth providers:
     - For web: GitHub recommended
     - For iOS: Apple Sign-In required (App Store requirement)
   - Configure redirect URLs:
     ```
     http://localhost:3000/**
     https://*-username.vercel.app/**
     ```

2. **Initialize Database**
   ```bash
   # Apply initial migration
   pnpm db:migrate
   ```
   This will run all migrations in `packages/db/migrations/`, including the initial setup that creates:
   - Auth tables
   - Profile table with auth user linkage
   - Post table with relationships
   - Necessary triggers for user management

## Database Development Workflow

### 1. Making Schema Changes

1. **Define Schema Changes**

   ```typescript
   // packages/db/src/schema/example.ts
   import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

   export const newFeature = pgTable("t3turbo_new_feature", {
     id: uuid("id").primaryKey().defaultRandom(),
     title: varchar("title", { length: 256 }).notNull(),
     createdAt: timestamp("created_at").defaultNow().notNull(),
   });
   ```

2. **Export Schema**
   ```typescript
   // packages/db/src/schema/index.ts
   export * from "./auth";
   export * from "./profile";
   export * from "./post";
   export * from "./example"; // Add new schema
   ```

### 2. Generate Migration

```bash
pnpm db:generate
```

This creates a new migration in `packages/db/migrations/` with:

- Timestamp-based naming
- Up and down migrations
- Schema changes in SQL format
- Updated migration journal

### 3. Review Migration

Check the generated files:

```
packages/db/migrations/
├── 0000_right_karnak.sql        # Initial migration
├── YYYYMMDDHHMMSS_new_name.sql  # Your new migration
└── meta/
    ├── _journal.json            # Migration history
    └── 0000_snapshot.json       # Schema snapshot
```

### 4. Apply Migration

```bash
# Apply to local database
pnpm db:migrate

# View changes in UI
pnpm db:studio
```

### 5. Commit Changes

```bash
git add packages/db/migrations/
git add packages/db/src/schema/
git commit -m "feat(db): add new feature table"
```

## Best Practices

### Schema Development

1. **Table Naming**

   ```typescript
   // DO: Use t3turbo_ prefix (configured in drizzle.config.ts)
   export const feature = pgTable("t3turbo_feature", {
     // ...
   });
   ```

2. **Relationships**

   ```typescript
   // DO: Use type-safe references
   authorId: uuid("author_id").references(() => profile.id, {
     onDelete: "cascade",  // Specify behavior
   }),
   ```

3. **Migrations**
   ```typescript
   // DON'T: Modify existing migrations
   // DO: Create new migrations for changes
   // DO: Keep migrations focused and atomic
   ```

### Production Deployment

1. **Migration Process**

   ```bash
   # 1. Generate migration locally
   pnpm db:generate

   # 2. Test locally
   pnpm db:migrate

   # 3. Commit and push
   git push origin main

   # 4. Vercel will automatically run migrations
   # (configured in build settings)
   ```

2. **Rollback Strategy**

   ```bash
   # 1. Create rollback migration
   pnpm db:generate --rollback

   # 2. Test rollback locally
   pnpm db:migrate

   # 3. If needed in production, deploy rollback
   vercel deploy
   ```

### Local Development

1. **Database Commands**

   ```bash
   # Generate migration
   pnpm db:generate

   # Apply migrations
   pnpm db:migrate

   # View database
   pnpm db:studio

   # Push schema (development only)
   pnpm db:push
   ```

2. **Type Generation**
   ```typescript
   // Types are automatically generated from your schema
   import { type Post } from "@acme/db/schema";
   ```

## Troubleshooting

If you encounter issues:

1. **Environment Variables**

   - Verify all variables in `.env`
   - Check Vercel project settings
   - Ensure Supabase connection strings are correct

2. **Database Issues**

   - Verify Supabase project is active
   - Check database triggers are properly set up
   - Ensure schema migrations are applied

3. **Auth Problems**

   - Verify auth provider configuration
   - Check redirect URLs in Supabase
   - Ensure proper API keys are set

4. **Migration Issues**

   ```bash
   # Check migration status
   pnpm db:migrate status

   # Reset database (development only)
   pnpm db:migrate reset

   # View migration logs
   cat packages/db/migrations/meta/_journal.json
   ```

5. **Schema Sync Issues**

   ```bash
   # Compare schemas
   pnpm db:generate --dry-run

   # Check for drift
   pnpm db:migrate check
   ```

For more help, check the [issues](https://github.com/t3-oss/create-t3-turbo/issues) or create a new one.

## Development

### Local Supabase Setup

1. **Start Local Supabase**

   ```bash
   # Install Supabase CLI if you haven't already
   brew install supabase/tap/supabase

   # Start local Supabase
   supabase start
   ```

   This will create a local Supabase instance with:

   - PostgreSQL database
   - GoTrue Auth server
   - PostgREST API
   - Storage API
   - Edge Functions support

2. **Update Environment Variables**

   ```bash
   # Get local credentials
   supabase status

   # Update .env with local credentials
   NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-local-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-local-service-role-key"
   POSTGRES_URL="postgresql://postgres:postgres@localhost:54322/postgres"
   ```

3. **Initialize Database**
   ```bash
   # Apply migrations to local database
   pnpm db:migrate
   ```

### Development Workflow

1. **Start Development Servers**

   ```bash
   # Start all services (Next.js, Expo, and watches for changes)
   pnpm dev

   # Or start specific services
   pnpm dev:web     # Next.js only
   pnpm dev:mobile  # Expo only
   ```

2. **Local Database Management**

   ```bash
   # View database with Supabase Studio
   supabase studio

   # Or use Drizzle Studio
   pnpm db:studio
   ```

3. **Switch Between Local and Remote**

   ```bash
   # Use local Supabase
   supabase start

   # Use remote Supabase (production)
   supabase stop
   ```

### Development Scripts

Available commands in `package.json`:

```json
{
  "scripts": {
    "dev": "pnpm with-env turbo dev",
    "dev:web": "pnpm with-env turbo dev --filter=@acme/nextjs...",
    "dev:mobile": "pnpm with-env turbo dev --filter=@acme/expo...",
    "with-env": "dotenv -e .env --"
  }
}
```

### Local Development Best Practices

1. **Database Changes**

   ```bash
   # Create new migration
   pnpm db:generate

   # Apply to local database
   pnpm db:migrate

   # Push changes without migration (development only)
   pnpm db:push
   ```

2. **Testing Auth Flows**

   - Local Supabase provides test users
   - Default credentials: `test@example.com` / `password`
   - Create test users in Supabase Studio

3. **Environment Switching**

   ```bash
   # Development (.env)
   NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"

   # Production (.env.production)
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   ```

4. **Debug Tools**
   - Supabase Dashboard: `http://localhost:54323`
   - Database: `http://localhost:54322`
   - API Docs: `http://localhost:54321/rest`
   - Authentication: `http://localhost:54321/auth`

### Troubleshooting Local Setup

1. **Database Connection Issues**

   ```bash
   # Check if Supabase is running
   supabase status

   # Restart Supabase
   supabase stop && supabase start

   # View logs
   supabase logs
   ```

2. **Port Conflicts**

   - Default ports: 54321 (API), 54322 (DB), 54323 (Studio)
   - Modify ports in `supabase/config.toml` if needed

3. **Reset Local Environment**

   ```bash
   # Reset everything
   supabase reset

   # Reset and start fresh
   supabase stop
   supabase start
   pnpm db:migrate
   ```

### Web (Next.js)

```bash
pnpm dev
```

### Mobile (Expo)

```bash
# iOS Simulator
pnpm --filter expo dev

# Android Emulator
pnpm --filter expo dev --android
```

## Package Generation

This project includes Turbo Generators for scaffolding new packages. To create a new package:

```bash
turbo gen init
```

The generator will prompt for:

1. Package name (automatically prefixed with @acme/)
2. Dependencies to install

Generated packages include:

- TypeScript configuration
- ESLint setup
- Standard npm scripts
- Proper monorepo integration

For detailed generator documentation, see [Turbo Generators](./turbo/GENERATORS.md).

## Mobile Development Notes

For iOS development, Apple Sign-In is required if you're using any third-party authentication (App Store requirement). The setup is preconfigured in `apps/expo/src/utils/auth.ts`.

## Contributing

1. Create a new branch
2. Make your changes
3. Create a PR
4. Ensure CI passes
5. Get approval and merge

supabase local dev env http://127.0.0.1:54323/
local inmail http://127.0.0.1:54324/
local front http://localhost:3000/
