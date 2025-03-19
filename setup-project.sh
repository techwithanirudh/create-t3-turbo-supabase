#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create empty .env file first
cat > .env << 'EOL'
EXPO_PUBLIC_SUPABASE_ANON_KEY=""
EXPO_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
NEXT_PUBLIC_SUPABASE_URL=""
POSTGRES_DATABASE=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_USER=""
SUPABASE_ANON_KEY=""
SUPABASE_DB_PASSWORD=""
SUPABASE_JWT_SECRET=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_URL=""
DB_PASSWORD=""
UPSTASH_REDIS_URL=""
UPSTASH_REDIS_TOKEN=""
EOL

# Function to set environment variable in both .env and Vercel
set_env_var() {
    local key=$1
    local value=$2
    local scope=${3:-"production"}

    # Update .env file
    sed -i '' "s|^${key}=.*|${key}=${value}|" .env
    
    # Set in Vercel
    echo -e "${BLUE}Setting $key in Vercel...${NC}"
    
    # Create a temporary file for the value
    local tmp_file=$(mktemp)
    echo "$value" > "$tmp_file"
    
    # Try to set the environment variable in Vercel
    if ! vercel env rm "$key" "$scope" -y > /dev/null 2>&1; then
        echo -e "${YELLOW}Note: $key doesn't exist in Vercel yet${NC}"
    fi
    
    # For public variables, set them separately for each environment
    if [[ "$scope" == *","* ]]; then
        local environments=(${scope//,/ })
        local success=true
        
        for env in "${environments[@]}"; do
            if ! vercel env add "$key" "$env" < "$tmp_file"; then
                echo -e "${RED}Failed to set $key in Vercel for environment: $env${NC}"
                success=false
            fi
        done
        
        rm "$tmp_file"
        if [ "$success" = true ]; then
            echo -e "${GREEN}✓ Successfully set $key in Vercel for all environments${NC}"
            return 0
        else
            return 1
        fi
    else
        if vercel env add "$key" "$scope" < "$tmp_file"; then
            echo -e "${GREEN}✓ Successfully set $key in Vercel${NC}"
            rm "$tmp_file"
            return 0
        else
            echo -e "${RED}Failed to set $key in Vercel${NC}"
            rm "$tmp_file"
            return 1
        fi
    fi
}

# Function to set all environment variables in Vercel
set_vercel_env_vars() {
    local project_url=$1
    local anon_key=$2
    local service_role_key=$3
    local db_password=$4
    local jwt_secret=$5
    local db_host=$6
    local db_port=$7
    local db_name=$8
    local db_user=$9
    
    echo -e "\n${BLUE}Setting environment variables in Vercel...${NC}"
    
    # Construct database URLs
    local postgres_url="postgresql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}"
    local postgres_prisma_url="postgresql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}?pgbouncer=true&connection_limit=1"
    local postgres_url_non_pooling="postgresql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}"
    
    # Set all environment variables
    local vars=(
        "POSTGRES_HOST|$db_host"
        "POSTGRES_DATABASE|$db_name"
        "POSTGRES_USER|$db_user"
        "POSTGRES_PASSWORD|$db_password"
        "POSTGRES_URL|$postgres_url"
        "POSTGRES_PRISMA_URL|$postgres_prisma_url"
        "POSTGRES_URL_NON_POOLING|$postgres_url_non_pooling"
        "DB_PASSWORD|$db_password"
        "SUPABASE_URL|$project_url"
        "SUPABASE_ANON_KEY|$anon_key"
        "SUPABASE_SERVICE_ROLE_KEY|$service_role_key"
        "SUPABASE_JWT_SECRET|$jwt_secret"
    )
    
    # Set public variables in both preview and production
    local public_vars=(
        "NEXT_PUBLIC_SUPABASE_URL|$project_url"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY|$anon_key"
        "EXPO_PUBLIC_SUPABASE_URL|$project_url"
        "EXPO_PUBLIC_SUPABASE_ANON_KEY|$anon_key"
    )
    
    # Set regular variables
    for var in "${vars[@]}"; do
        IFS="|" read -r key value <<< "$var"
        if ! set_env_var "$key" "$value" "production"; then
            echo -e "${RED}Failed to set $key in Vercel${NC}"
            return 1
        fi
    done
    
    # Set public variables in both preview and production
    for var in "${public_vars[@]}"; do
        IFS="|" read -r key value <<< "$var"
        if ! set_env_var "$key" "$value" "preview,production"; then
            echo -e "${RED}Failed to set $key in Vercel${NC}"
            return 1
        fi
    done
    
    echo -e "${GREEN}✓ Successfully set all environment variables in Vercel${NC}"
    return 0
}

# Function to generate a random project name
generate_project_name() {
    local adjectives=("amber" "azure" "bold" "brave" "calm" "clear" "crisp" "dark" "deep" "epic" "fair" "fast" "fresh" "gold" "grand" "keen" "kind" "light" "pure" "quick" "sharp" "silk" "swift" "wise")
    local nouns=("arc" "bay" "beam" "bird" "bloom" "brook" "cloud" "coast" "core" "dawn" "dune" "edge" "flow" "frost" "gate" "glen" "grove" "haven" "hill" "lake" "leaf" "moon" "peak" "port" "rain" "reef" "rise" "road" "shore" "sky" "spring" "star" "stream" "sun" "vale" "wave" "wind")
    
    local adj=${adjectives[$RANDOM % ${#adjectives[@]}]}
    local noun=${nouns[$RANDOM % ${#nouns[@]}]}
    echo "${adj}-${noun}"
}

echo -e "${BLUE}T3 Turbo Supabase + Vercel Project Setup${NC}"

# Get or generate project name
echo -e "\n${BLUE}Project name (press enter for random name):${NC}"
read PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-$(generate_project_name)}

# Set project directory
PROJECT_DIR="$HOME/Desktop/${PROJECT_NAME}"

REPO_URL="https://github.com/pedromshin/create-t3-turbo-supabase"
DB_PASSWORD=$(openssl rand -base64 16)
JWT_SECRET=$(openssl rand -base64 32)

echo -e "\n${BLUE}Using configuration:${NC}"
echo -e "Project name: ${PROJECT_NAME}"
echo -e "Location: ${PROJECT_DIR}"

# Check and install required tools silently
echo -e "\n${BLUE}Installing dependencies...${NC}"

# Install Homebrew if needed
if ! command -v brew &> /dev/null; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" > /dev/null 2>&1
fi

# Install Node.js if needed
if ! command -v node &> /dev/null; then
    brew install node > /dev/null 2>&1
fi

# Install/update pnpm
REQUIRED_PNPM_VERSION="9.15.4"
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm@${REQUIRED_PNPM_VERSION} > /dev/null 2>&1
else
    npm install -g pnpm@${REQUIRED_PNPM_VERSION} > /dev/null 2>&1
fi

# Install/update Supabase CLI
if ! command -v supabase &> /dev/null; then
    brew install supabase/tap/supabase > /dev/null 2>&1
else
    brew upgrade supabase > /dev/null 2>&1
fi

# Install Vercel CLI if needed
if ! command -v vercel &> /dev/null; then
    npm install -g vercel > /dev/null 2>&1
fi

# Install git if needed
if ! command -v git &> /dev/null; then
    brew install git > /dev/null 2>&1
fi

# Setup project
echo -e "\n${BLUE}Setting up project...${NC}"
rm -rf "$PROJECT_DIR" 2>/dev/null || true
mkdir -p "$PROJECT_DIR"

# Clone repository and setup git
echo -e "\n${BLUE}Setting up Git repository...${NC}"
if ! git clone "$REPO_URL" "$PROJECT_DIR" > /dev/null 2>&1; then
    echo -e "${RED}Failed to clone repository. Please check your internet connection.${NC}"
    exit 1
fi

# Change to project directory
cd "$PROJECT_DIR" || {
    echo -e "${RED}Failed to change to project directory.${NC}"
    exit 1
}

# Verify we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Project setup failed - package.json not found.${NC}"
    exit 1
fi

# Initialize new git repository
rm -rf .git
git init
git add .
git commit -m "Initial commit from T3 Turbo template"

# Create GitHub repository and push
echo -e "\n${BLUE}Creating GitHub repository...${NC}"

# Try to get GitHub username automatically first
if command -v gh &> /dev/null; then
    if GITHUB_USERNAME=$(gh api user -q .login 2>/dev/null); then
        echo -e "${GREEN}Using GitHub username: ${GITHUB_USERNAME}${NC}"
    else
        echo -e "${BLUE}Please enter your GitHub username:${NC}"
        read -r GITHUB_USERNAME
    fi
else
    echo -e "${BLUE}Please enter your GitHub username:${NC}"
    read -r GITHUB_USERNAME
fi

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}No GitHub username provided.${NC}"
    exit 1
fi

# Function to push to GitHub with retries
push_to_github() {
    local max_retries=3
    local retry_count=0
    local success=false

    while [ $retry_count -lt $max_retries ] && [ "$success" = false ]; do
        if git push -u origin main; then
            success=true
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $max_retries ]; then
                echo -e "${YELLOW}Push attempt $retry_count failed. Waiting 10 seconds before retry...${NC}"
                sleep 10
                # Try to fix common issues before retrying
                git remote remove origin
                git remote add origin "https://github.com/$GITHUB_USERNAME/$PROJECT_NAME.git"
            fi
        fi
    done

    if [ "$success" = false ]; then
        echo -e "${RED}Failed to push to GitHub after $max_retries attempts.${NC}"
        return 1
    fi
    return 0
}

# Create GitHub repository using GitHub CLI if available, otherwise prompt for manual creation
if command -v gh &> /dev/null; then
    echo -e "${BLUE}Creating repository using GitHub CLI...${NC}"
    if ! gh auth status &>/dev/null; then
        echo -e "${BLUE}Please login to GitHub CLI:${NC}"
        gh auth login
    fi
    
    # Create repository with retries
    max_retries=3
    retry_count=0
    create_success=false

    while [ $retry_count -lt $max_retries ] && [ "$create_success" = false ]; do
        if gh repo create "$GITHUB_USERNAME/$PROJECT_NAME" --private --source=. --remote=origin; then
            create_success=true
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $max_retries ]; then
                echo -e "${YELLOW}Create attempt $retry_count failed. Waiting 10 seconds before retry...${NC}"
                sleep 10
            fi
        fi
    done

    if [ "$create_success" = false ]; then
        echo -e "${RED}Failed to create GitHub repository after $max_retries attempts.${NC}"
        exit 1
    fi

    # Push with retries
    if ! push_to_github; then
        exit 1
    fi
else
    echo -e "${YELLOW}GitHub CLI not found. Please create a repository manually at:${NC}"
    echo -e "${GREEN}https://github.com/new${NC}"
    echo -e "Repository name: ${PROJECT_NAME}"
    echo -e "Press Enter once you've created the repository..."
    read -r
    
    echo -e "${BLUE}Adding GitHub remote...${NC}"
    git remote add origin "https://github.com/$GITHUB_USERNAME/$PROJECT_NAME.git"
    
    echo -e "${BLUE}Pushing to GitHub...${NC}"
    if ! push_to_github; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ Successfully created and pushed to GitHub repository${NC}"

# Install dependencies
echo -e "${BLUE}Installing project dependencies...${NC}"
if ! pnpm install > /dev/null 2>&1; then
    echo -e "${RED}Failed to install dependencies.${NC}"
    exit 1
fi

# Vercel setup first
echo -e "\n${BLUE}Setting up Vercel...${NC}"
if ! vercel whoami &>/dev/null; then
    echo -e "${BLUE}Please login to Vercel:${NC}"
    vercel login
fi

# Initialize Vercel project and connect to GitHub
echo -e "\n${BLUE}Creating Vercel project and connecting to GitHub...${NC}"
if ! vercel link --yes; then
    echo -e "${RED}Failed to link Vercel project${NC}"
    exit 1
fi

# Import GitHub repository to Vercel
echo -e "\n${BLUE}Importing GitHub repository to Vercel...${NC}"
if ! vercel git connect; then
    echo -e "${RED}Failed to connect GitHub repository to Vercel${NC}"
    exit 1
fi

# Now Supabase setup
echo -e "\n${BLUE}Setting up Supabase...${NC}"
if ! supabase projects list &>/dev/null; then
    echo -e "${BLUE}Please login to Supabase:${NC}"
    supabase login
fi

# Get organization ID automatically if possible
echo -e "${BLUE}Available Supabase organizations:${NC}"
supabase orgs list
echo -e "\n${BLUE}Enter the organization ID from above:${NC}"
read -r ORG_ID

if [ -z "$ORG_ID" ]; then
    echo -e "${RED}No organization ID provided. Please create an organization in the Supabase dashboard first.${NC}"
    exit 1
fi

# Get region selection
echo -e "${BLUE}Available regions:${NC}"
echo "1) af-south-1 (Cape Town)"
echo "2) ap-northeast-1 (Tokyo)"
echo "3) ap-northeast-2 (Seoul)"
echo "4) ap-south-1 (Mumbai)"
echo "5) ap-southeast-1 (Singapore)"
echo "6) ap-southeast-2 (Sydney)"
echo "7) ca-central-1 (Central Canada)"
echo "8) eu-central-1 (Frankfurt)"
echo "9) eu-west-1 (London)"
echo "10) eu-west-2 (Ireland)"
echo "11) eu-west-3 (Paris)"
echo "12) sa-east-1 (São Paulo)"
echo "13) us-east-1 (N. Virginia)"
echo "14) us-west-1 (N. California)"
echo "15) us-west-2 (Oregon)"
echo -e "\n${BLUE}Select region (1-15) [default: 13]:${NC}"
read -r REGION_CHOICE

case $REGION_CHOICE in
    1) REGION="af-south-1";;
    2) REGION="ap-northeast-1";;
    3) REGION="ap-northeast-2";;
    4) REGION="ap-south-1";;
    5) REGION="ap-southeast-1";;
    6) REGION="ap-southeast-2";;
    7) REGION="ca-central-1";;
    8) REGION="eu-central-1";;
    9) REGION="eu-west-1";;
    10) REGION="eu-west-2";;
    11) REGION="eu-west-3";;
    12) REGION="sa-east-1";;
    14) REGION="us-west-1";;
    15) REGION="us-west-2";;
    *) REGION="us-east-1";;  # Default to US East
esac

# Create Supabase project with retries
echo -e "\n${BLUE}Creating Supabase project in ${REGION}...${NC}"
MAX_CREATE_RETRIES=3
CREATE_RETRY=0
CREATE_SUCCESS=false

while [ $CREATE_RETRY -lt $MAX_CREATE_RETRIES ] && [ "$CREATE_SUCCESS" = false ]; do
    if PROJECT_OUTPUT=$(supabase projects create "${PROJECT_NAME}" --db-password "${DB_PASSWORD}" --org-id "${ORG_ID}" --region "${REGION}" 2>&1); then
        SUPABASE_PROJECT_ID=$(echo "$PROJECT_OUTPUT" | grep -o "dashboard/project/[a-zA-Z0-9]*" | cut -d'/' -f3)
        CREATE_SUCCESS=true
        echo -e "${GREEN}✓ Successfully created Supabase project${NC}"
    else
        # Check if project was created despite error
        if echo "$PROJECT_OUTPUT" | grep -q "dashboard/project/"; then
            SUPABASE_PROJECT_ID=$(echo "$PROJECT_OUTPUT" | grep -o "dashboard/project/[a-zA-Z0-9]*" | cut -d'/' -f3)
            CREATE_SUCCESS=true
            echo -e "${GREEN}Project was created successfully despite the error${NC}"
        else
            # Try to find the project in the list
            sleep 5
            PROJECT_LIST=$(supabase projects list)
            if echo "$PROJECT_LIST" | grep -q "${PROJECT_NAME}"; then
                SUPABASE_PROJECT_ID=$(echo "$PROJECT_LIST" | grep "${PROJECT_NAME}" | awk '{print $1}')
                CREATE_SUCCESS=true
                echo -e "${GREEN}Found project in project list${NC}"
            else
                CREATE_RETRY=$((CREATE_RETRY + 1))
                if [ $CREATE_RETRY -lt $MAX_CREATE_RETRIES ]; then
                    echo -e "${YELLOW}Create attempt $CREATE_RETRY failed. Waiting 10 seconds before retry...${NC}"
                    sleep 10
                fi
            fi
        fi
    fi
done

if [ "$CREATE_SUCCESS" = false ] || [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo -e "${RED}Failed to create Supabase project after multiple attempts.${NC}"
    exit 1
fi

echo -e "${GREEN}Successfully created project with ID: ${SUPABASE_PROJECT_ID}${NC}"

# Since we already have access to the project dashboard and API keys,
# we can skip the waiting period and use default connection values
echo -e "${BLUE}Setting up database connection details...${NC}"

# Get API keys from user
echo -e "\n${BLUE}Please enter the anon public key from the dashboard:${NC}"
read -r ANON_KEY
echo -e "${BLUE}Please enter the service role key from the dashboard:${NC}"
read -r SERVICE_ROLE_KEY
echo -e "${BLUE}Please enter the database password from the dashboard:${NC}"
read -r DB_PASSWORD

if [ -z "$ANON_KEY" ] || [ -z "$SERVICE_ROLE_KEY" ] || [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}API keys and database password are required to continue${NC}"
    exit 1
fi

# Wait for user confirmation that project is ready
echo -e "\n${YELLOW}Waiting for Supabase project to be fully ready...${NC}"
echo -e "Please wait until you see the project is ready in the Supabase dashboard:"
echo -e "${GREEN}https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}${NC}"
echo -e "Press Enter when the project shows as 'Ready' in the dashboard..."
read -r

# Verify database connection before proceeding with retries
echo -e "\n${BLUE}Verifying database connection...${NC}"
MAX_CONN_RETRIES=5
CONN_RETRY=0
CONN_SUCCESS=false

# Construct proper connection string with explicit SSL mode
PSQL_CONN_STRING="postgresql://postgres:${DB_PASSWORD}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres?sslmode=require"

while [ $CONN_RETRY -lt $MAX_CONN_RETRIES ] && [ "$CONN_SUCCESS" = false ]; do
    echo -e "Attempt $((CONN_RETRY + 1)) of ${MAX_CONN_RETRIES}..."
    # Add -v flag for verbose output to help debug connection issues
    if PGSSLMODE=require psql "$PSQL_CONN_STRING" -v ON_ERROR_STOP=1 -X --set AUTOCOMMIT=off -c "SELECT version();" > /dev/null 2>&1; then
        CONN_SUCCESS=true
        echo -e "${GREEN}✓ Successfully connected to database${NC}"
    else
        CONN_RETRY=$((CONN_RETRY + 1))
        if [ $CONN_RETRY -lt $MAX_CONN_RETRIES ]; then
            echo -e "${YELLOW}Connection attempt failed. Waiting 15 seconds before retry...${NC}"
            # Increase wait time to allow for DNS propagation
            sleep 15
        fi
    fi
done

if [ "$CONN_SUCCESS" = false ]; then
    echo -e "${RED}Could not connect to database after ${MAX_CONN_RETRIES} attempts. Please verify:${NC}"
    echo -e "1. The project is fully ready in the Supabase dashboard"
    echo -e "2. The database password is correct"
    echo -e "3. Wait a few minutes and try again (DNS propagation can take time)"
    echo -e "\nConnection string being used:"
    echo -e "${PSQL_CONN_STRING}"
    echo -e "\nTrying to get more error details..."
    PGSSLMODE=require psql "$PSQL_CONN_STRING" -v ON_ERROR_STOP=1 -X --set AUTOCOMMIT=off -c "SELECT version();"
    exit 1
fi

# Update the connection string for all subsequent commands
PSQL_CONN_STRING="postgresql://postgres:${DB_PASSWORD}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres?sslmode=require"

# Setup database schema and migrations
echo -e "\n${BLUE}Setting up database schema and migrations...${NC}"

# Create auth schema and tables if they don't exist
echo -e "${BLUE}Creating auth schema and tables...${NC}"
SETUP_AUTH_SQL=$(cat << 'EOL'
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid PRIMARY KEY NOT NULL
);
EOL
)

if echo "$SETUP_AUTH_SQL" | psql "$PSQL_CONN_STRING"; then
    echo -e "${GREEN}✓ Successfully created auth schema and tables${NC}"
else
    echo -e "${RED}Failed to create auth schema and tables${NC}"
    exit 1
fi

# Create initial tables from migration
echo -e "${BLUE}Creating initial tables from migration...${NC}"
INITIAL_MIGRATION=$(cat << 'EOL'
CREATE TABLE IF NOT EXISTS "t3turbo_profile" (
    "id" uuid PRIMARY KEY NOT NULL,
    "name" varchar(256) NOT NULL,
    "image" varchar(256),
    "email" varchar(256)
);

CREATE TABLE IF NOT EXISTS "t3turbo_post" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" varchar(256) NOT NULL,
    "content" text NOT NULL,
    "author_id" uuid NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp with time zone
);

DO $$ BEGIN
    ALTER TABLE "t3turbo_profile" ADD CONSTRAINT "t3turbo_profile_id_users_id_fk" 
        FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "t3turbo_post" ADD CONSTRAINT "t3turbo_post_author_id_t3turbo_profile_id_fk" 
        FOREIGN KEY ("author_id") REFERENCES "public"."t3turbo_profile"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
EOL
)

if echo "$INITIAL_MIGRATION" | psql "$PSQL_CONN_STRING"; then
    echo -e "${GREEN}✓ Successfully created initial tables${NC}"
else
    echo -e "${RED}Failed to create initial tables${NC}"
    exit 1
fi

# Setup auth trigger for new users
echo -e "${BLUE}Setting up auth trigger for new users...${NC}"
AUTH_TRIGGER=$(cat << 'EOL'
create or replace function public.handle_new_user()
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

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_verified ON auth.users;

-- Create new triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TRIGGER on_auth_user_verified
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (old.last_sign_in_at IS NULL AND new.last_sign_in_at IS NOT NULL)
    EXECUTE PROCEDURE public.handle_new_user();
EOL
)

if echo "$AUTH_TRIGGER" | psql "$PSQL_CONN_STRING"; then
    echo -e "${GREEN}✓ Successfully set up auth triggers${NC}"
else
    echo -e "${RED}Failed to set up auth triggers${NC}"
    exit 1
fi

# Revoke public schema access
echo -e "${BLUE}Revoking public schema access...${NC}"
REVOKE_ACCESS="REVOKE USAGE ON SCHEMA public FROM anon, authenticated;"

if echo "$REVOKE_ACCESS" | psql "$PSQL_CONN_STRING"; then
    echo -e "${GREEN}✓ Successfully revoked public schema access${NC}"
else
    echo -e "${RED}Failed to revoke public schema access${NC}"
    exit 1
fi

# Configure Email and Auth Settings
echo -e "\n${BLUE}Configuring Email and Auth settings...${NC}"

# Get the access token
AUTH_TOKEN=$(supabase status --access-token)
if [ -z "$AUTH_TOKEN" ]; then
    echo -e "${RED}Failed to get Supabase access token${NC}"
    exit 1
fi

# Configure Email Template
echo -e "${BLUE}Configuring Email Templates...${NC}"
EMAIL_TEMPLATE_JSON=$(cat << EOF
{
  "template": "signup",
  "subject": "Confirm your signup",
  "content": {
    "html": "<h2>Confirm your signup</h2><p>Follow this link to confirm your user:</p><p><a href=\"{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=signup\">Confirm your email</a></p>",
    "text": "Confirm your signup. Follow this link to confirm your user: {{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=signup"
  }
}
EOF
)

if ! curl -X PUT \
    "https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/auth/email-templates/signup" \
    -H "Authorization: Bearer ${AUTH_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$EMAIL_TEMPLATE_JSON"; then
    echo -e "${RED}Failed to update email template${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Successfully configured email template${NC}"

# Configure Auth Settings
echo -e "${BLUE}Configuring Auth Settings...${NC}"

# Get the production URL (using Vercel project URL or default to localhost)
PRODUCTION_URL="https://${PROJECT_NAME}-${GITHUB_USERNAME}.vercel.app"
LOCAL_URL="http://localhost:3000"

AUTH_SETTINGS_JSON=$(cat << EOF
{
  "site_url": "${PRODUCTION_URL}",
  "additional_redirect_urls": [
    "${LOCAL_URL}/**",
    "https://*-${GITHUB_USERNAME}.vercel.app/**"
  ]
}
EOF
)

if ! curl -X PUT \
    "https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/auth/config" \
    -H "Authorization: Bearer ${AUTH_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$AUTH_SETTINGS_JSON"; then
    echo -e "${RED}Failed to update auth settings${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Successfully configured auth settings${NC}"

# Configure Auth Providers (GitHub and Apple)
echo -e "${BLUE}Would you like to configure GitHub authentication? (y/n)${NC}"
read -r SETUP_GITHUB

if [ "$SETUP_GITHUB" = "y" ]; then
    echo -e "${BLUE}Please enter your GitHub OAuth Client ID:${NC}"
    read -r GITHUB_CLIENT_ID
    echo -e "${BLUE}Please enter your GitHub OAuth Client Secret:${NC}"
    read -r GITHUB_CLIENT_SECRET

    GITHUB_PROVIDER_JSON=$(cat << EOF
{
  "enabled": true,
  "client_id": "${GITHUB_CLIENT_ID}",
  "client_secret": "${GITHUB_CLIENT_SECRET}",
  "redirect_uri": "${PRODUCTION_URL}/auth/callback"
}
EOF
)

    if ! curl -X PUT \
        "https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/auth/providers/github" \
        -H "Authorization: Bearer ${AUTH_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "$GITHUB_PROVIDER_JSON"; then
        echo -e "${RED}Failed to configure GitHub provider${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Successfully configured GitHub authentication${NC}"
fi

echo -e "${BLUE}Would you like to configure Apple authentication? (y/n)${NC}"
read -r SETUP_APPLE

if [ "$SETUP_APPLE" = "y" ]; then
    echo -e "${BLUE}Please enter your Apple Service ID:${NC}"
    read -r APPLE_SERVICE_ID
    echo -e "${BLUE}Please enter your Apple Team ID:${NC}"
    read -r APPLE_TEAM_ID
    echo -e "${BLUE}Please enter your Apple Key ID:${NC}"
    read -r APPLE_KEY_ID
    echo -e "${BLUE}Please enter your Apple Private Key (paste and press Ctrl+D when done):${NC}"
    APPLE_PRIVATE_KEY=$(cat)

    APPLE_PROVIDER_JSON=$(cat << EOF
{
  "enabled": true,
  "client_id": "${APPLE_SERVICE_ID}",
  "team_id": "${APPLE_TEAM_ID}",
  "key_id": "${APPLE_KEY_ID}",
  "private_key": "${APPLE_PRIVATE_KEY}",
  "redirect_uri": "${PRODUCTION_URL}/auth/callback"
}
EOF
)

    if ! curl -X PUT \
        "https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/auth/providers/apple" \
        -H "Authorization: Bearer ${AUTH_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "$APPLE_PROVIDER_JSON"; then
        echo -e "${RED}Failed to configure Apple provider${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Successfully configured Apple authentication${NC}"
fi

# Create Supabase config and link project
echo -e "${BLUE}Creating Supabase configuration...${NC}"
CONFIG_DIR="supabase"
mkdir -p "$CONFIG_DIR"

# Create config.toml with proper auth configuration
cat > "${CONFIG_DIR}/config.toml" << EOL
project_id = "${SUPABASE_PROJECT_ID}"

[auth]
enabled = true
site_url = "http://localhost:3000"
additional_redirect_urls = []
jwt_expiry = 3600
enable_refresh_token_rotation = true
refresh_token_reuse_interval = 10

[auth.email]
enable_signup = true
double_confirm_changes = true
enable_confirmations = true
secure_password_change = false
max_frequency = "1m0s"
otp_length = 6
otp_expiry = 3600
EOL

# Link Supabase project with retries
echo -e "${BLUE}Linking Supabase project...${NC}"
MAX_LINK_RETRIES=3
LINK_RETRY=0
LINK_SUCCESS=false

while [ $LINK_RETRY -lt $MAX_LINK_RETRIES ] && [ "$LINK_SUCCESS" = false ]; do
    if supabase link --project-ref "$SUPABASE_PROJECT_ID" --password "$DB_PASSWORD"; then
        LINK_SUCCESS=true
        echo -e "${GREEN}✓ Successfully linked Supabase project${NC}"
    else
        LINK_RETRY=$((LINK_RETRY + 1))
        if [ $LINK_RETRY -lt $MAX_LINK_RETRIES ]; then
            echo -e "${YELLOW}Link attempt $LINK_RETRY failed. Waiting 10 seconds before retry...${NC}"
            sleep 10
        fi
    fi
done

if [ "$LINK_SUCCESS" = false ]; then
    echo -e "${RED}Failed to link Supabase project after $MAX_LINK_RETRIES attempts${NC}"
    exit 1
fi

# Function to get project settings with retries and proper error handling
get_project_settings() {
    local max_retries=3
    local retry_count=0
    local settings=""
    
    while [ $retry_count -lt $max_retries ]; do
        # First try without --debug flag
        if settings=$(supabase projects get --project-ref "$SUPABASE_PROJECT_ID" 2>/dev/null) ||
           settings=$(supabase projects get --project-ref "$SUPABASE_PROJECT_ID" --debug 2>/dev/null); then
            # Verify we got valid JSON output
            if echo "$settings" | grep -q '"db_host":\|"api_url":'; then
                echo "$settings"
                return 0
            fi
        fi
        
        retry_count=$((retry_count + 1))
        if [ $retry_count -lt $max_retries ]; then
            echo -e "${YELLOW}Failed to get project settings. Retrying in 10 seconds... (Attempt $retry_count/$max_retries)${NC}"
            sleep 10
        fi
    done
    
    # If we get here, try one last time with direct API call
    if command -v curl &> /dev/null; then
        local auth_token
        auth_token=$(supabase status --access-token 2>/dev/null)
        if [ -n "$auth_token" ]; then
            settings=$(curl -s -H "Authorization: Bearer $auth_token" \
                "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_ID")
            if echo "$settings" | grep -q '"db_host":\|"api_url":'; then
                echo "$settings"
                return 0
            fi
        fi
    fi
    
    return 1
}

# Get project settings and set environment variables
echo -e "\n${BLUE}Configuring environment variables...${NC}"
if ! PROJECT_SETTINGS=$(get_project_settings); then
    echo -e "${YELLOW}Failed to get project settings automatically. Using default values...${NC}"
    
    # Use default values based on project ID
    DB_HOST="db.${SUPABASE_PROJECT_ID}.supabase.co"
    DB_NAME="postgres"
    DB_PORT="5432"
    DB_USER="postgres"
    PROJECT_URL="https://${SUPABASE_PROJECT_ID}.supabase.co"
    
    # Only prompt for API keys since they can't be derived
    echo -e "\nPlease go to ${GREEN}https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/settings/api${NC}"
    echo -e "And copy the following values:"
    echo -e "1. anon public"
    echo -e "2. service_role"
    echo -e "Press Enter when ready..."
    read -r
    
    echo -e "\n${BLUE}Enter anon key:${NC}"
    read -r ANON_KEY
    echo -e "${BLUE}Enter service role key:${NC}"
    read -r SERVICE_ROLE_KEY
    
    # Set environment variables with default values
    if [ -n "$ANON_KEY" ] && [ -n "$SERVICE_ROLE_KEY" ]; then
        if ! set_vercel_env_vars \
            "$PROJECT_URL" \
            "$ANON_KEY" \
            "$SERVICE_ROLE_KEY" \
            "$DB_PASSWORD" \
            "$JWT_SECRET" \
            "$DB_HOST" \
            "$DB_PORT" \
            "$DB_NAME" \
            "$DB_USER"; then
            echo -e "${RED}Failed to set environment variables in Vercel${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Missing required API keys${NC}"
        exit 1
    fi
else
    # Extract settings from API response
    DB_HOST=$(echo "$PROJECT_SETTINGS" | grep -o '"db_host": "[^"]*' | cut -d'"' -f4)
    DB_PORT=$(echo "$PROJECT_SETTINGS" | grep -o '"db_port": [0-9]*' | cut -d' ' -f2)
    DB_NAME=$(echo "$PROJECT_SETTINGS" | grep -o '"db_name": "[^"]*' | cut -d'"' -f4)
    DB_USER=$(echo "$PROJECT_SETTINGS" | grep -o '"db_user": "[^"]*' | cut -d'"' -f4)
    PROJECT_URL=$(echo "$PROJECT_SETTINGS" | grep -o '"api_url": "[^"]*' | cut -d'"' -f4)
    
    # Get API settings with retries
    if API_SETTINGS=$(supabase projects api-keys --project-ref "$SUPABASE_PROJECT_ID" 2>/dev/null); then
        ANON_KEY=$(echo "$API_SETTINGS" | grep "anon" | awk '{print $2}')
        SERVICE_ROLE_KEY=$(echo "$API_SETTINGS" | grep "service_role" | awk '{print $2}')
        
        if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ] && [ -n "$DB_NAME" ] && [ -n "$DB_USER" ] && \
           [ -n "$ANON_KEY" ] && [ -n "$SERVICE_ROLE_KEY" ] && [ -n "$PROJECT_URL" ]; then
            if ! set_vercel_env_vars \
                "$PROJECT_URL" \
                "$ANON_KEY" \
                "$SERVICE_ROLE_KEY" \
                "$DB_PASSWORD" \
                "$JWT_SECRET" \
                "$DB_HOST" \
                "$DB_PORT" \
                "$DB_NAME" \
                "$DB_USER"; then
                echo -e "${RED}Failed to set environment variables in Vercel${NC}"
                exit 1
            fi
        else
            echo -e "${RED}Missing required Supabase configuration values${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Failed to get Supabase API keys${NC}"
        exit 1
    fi
fi

# Configure Vercel project settings
echo -e "\n${BLUE}Configuring Vercel project settings...${NC}"

# Set root directory and other settings using vercel project settings set
if ! vercel project settings set rootDirectory "apps/nextjs"; then
    echo -e "${YELLOW}Warning: Failed to set root directory${NC}"
fi

# Set framework preset
if ! vercel project settings set framework nextjs; then
    echo -e "${YELLOW}Warning: Failed to set framework settings${NC}"
fi

# Set build command for monorepo
if ! vercel project settings set buildCommand "cd ../.. && pnpm install && pnpm turbo run build --filter=@acme/nextjs..."; then
    echo -e "${YELLOW}Warning: Failed to set build command${NC}"
fi

# Set output directory
if ! vercel project settings set outputDirectory ".next"; then
    echo -e "${YELLOW}Warning: Failed to set output directory${NC}"
fi

# Set install command
if ! vercel project settings set installCommand "pnpm install"; then
    echo -e "${YELLOW}Warning: Failed to set install command${NC}"
fi

# Pull environment variables from Vercel with retries
echo -e "\n${BLUE}Pulling environment variables from Vercel...${NC}"
MAX_ENV_RETRIES=3
ENV_RETRY=0
ENV_SUCCESS=false

while [ $ENV_RETRY -lt $MAX_ENV_RETRIES ] && [ "$ENV_SUCCESS" = false ]; do
    if vercel env pull .env --yes; then
        # Verify that the .env file is not empty and contains our expected variables
        if [ -s .env ] && grep -q "NEXT_PUBLIC_SUPABASE_URL" .env; then
            ENV_SUCCESS=true
            echo -e "${GREEN}✓ Successfully pulled environment variables${NC}"
        else
            echo -e "${YELLOW}Environment file appears to be empty or missing critical variables${NC}"
            # Force pull with environment specification
            if vercel env pull .env --environment=production --yes; then
                if [ -s .env ] && grep -q "NEXT_PUBLIC_SUPABASE_URL" .env; then
                    ENV_SUCCESS=true
                    echo -e "${GREEN}✓ Successfully pulled environment variables on second attempt${NC}"
                fi
            fi
        fi
    fi
    
    if [ "$ENV_SUCCESS" = false ]; then
        ENV_RETRY=$((ENV_RETRY + 1))
        if [ $ENV_RETRY -lt $MAX_ENV_RETRIES ]; then
            echo -e "${YELLOW}Retry $ENV_RETRY: Waiting before next attempt...${NC}"
            sleep 10
        fi
    fi
done

if [ "$ENV_SUCCESS" = false ]; then
    echo -e "${RED}Warning: Could not verify environment variables were pulled correctly${NC}"
    echo -e "${YELLOW}Please check your Vercel project settings and ensure environment variables are set${NC}"
    echo -e "${YELLOW}You may need to manually copy environment variables after setup${NC}"
fi

# Deploy to Vercel
echo -e "\n${BLUE}Deploying to Vercel...${NC}"
if ! vercel deploy --prod --yes; then
    echo -e "${RED}Failed to deploy to Vercel${NC}"
    exit 1
fi

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "${BLUE}Project location:${NC} ${PROJECT_DIR}"
echo -e "${BLUE}Environment variables:${NC} .env"
echo -e "${BLUE}Vercel Dashboard:${NC} https://vercel.com/dashboard"
echo -e "${BLUE}Supabase Dashboard:${NC} https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}"

echo -e "\n${BLUE}Next steps:${NC}"
echo -e "1. Set up Upstash Redis and add the environment variables to both .env and Vercel"
echo -e "2. Start development with: ${GREEN}pnpm dev${NC}"