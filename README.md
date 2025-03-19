# T3 Turbo x Supabase

A full-stack, typesafe starter monorepo with Next.js, React Native, and Supabase, featuring:

- 🏎 Turborepo
- 🚀 Next.js (web) + Expo (mobile)
- 🔐 Supabase Auth
- 🎨 Tailwind CSS
- 💻 TypeScript
- 📱 React Native
- 🧰 Turbo Generators

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

2. **Set Up Database Trigger**
   Run this SQL in your Supabase SQL Editor:

   ```sql
   -- Create profile handler function
   create function public.handle_new_user()
   returns trigger
   language plpgsql
   security definer set search_path = public
   as $$
   begin
     insert into public.t3turbo_profile (id, email, name, image)
     values (
       new.id,
       new.email,
       COALESCE(
         new.raw_user_meta_data ->> 'name',
         new.raw_user_meta_data ->> 'full_name',
         new.raw_user_meta_data ->> 'user_name',
         '[redacted]'
       ),
       new.raw_user_meta_data ->> 'avatar_url'
     )
     on conflict (id) do update set
       email = excluded.email,
       name = excluded.name,
       image = excluded.image;
     return new;
   end;
   $$;

   -- Create triggers
   create trigger on_auth_user_created
     after insert on auth.users
     for each row execute procedure public.handle_new_user();

   create trigger on_auth_user_verified
     after update on auth.users
     for each row when (
       old.last_sign_in_at is null
       and new.last_sign_in_at is not null
     ) execute procedure public.handle_new_user();
   ```

3. **Secure Database Access**
   Run this SQL to disable direct public access:
   ```sql
   REVOKE USAGE ON SCHEMA public FROM anon, authenticated;
   ```

## Development

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

For more help, check the [issues](https://github.com/t3-oss/create-t3-turbo/issues) or create a new one.
