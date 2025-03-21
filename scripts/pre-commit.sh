#!/bin/bash

# Define colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Create temp directory for logs
TEMP_DIR=$(mktemp -d)
# Create persistent log directory
LOG_DIR="./.logs/pre-commit"
mkdir -p "$LOG_DIR"
FAILED_STEPS=()
FAILED_LOGS=()

# Function to display step with timing
run_step() {
  local step_name=$1
  local command=$2
  local step_num=$3
  local total_steps=$4
  local log_file="${TEMP_DIR}/${step_name// /_}.log"
  
  echo -e "\n${BLUE}[${step_num}/${total_steps}]${NC} ${YELLOW}Running ${step_name}...${NC}"
  
  start_time=$(date +%s)
  
  # Run command and capture output to log file
  if eval "$command" > "$log_file" 2>&1; then
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    echo -e "${GREEN}✓ ${step_name} passed${NC} (${duration}s)"
    return 0
  else
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    echo -e "${RED}✗ ${step_name} failed${NC} (${duration}s)"
    
    # Store failed step information
    FAILED_STEPS+=("$step_name")
    FAILED_LOGS+=("$log_file")
    
    # Save to persistent log file with timestamp
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local persistent_log="${LOG_DIR}/${timestamp}_${step_name// /_}.log"
    cp "$log_file" "$persistent_log"
    echo -e "${YELLOW}Error log saved to ${persistent_log}${NC}"
    
    return 1
  fi
}

# Function to display all failed logs
show_failed_logs() {
  if [ ${#FAILED_STEPS[@]} -eq 0 ]; then
    return 0
  fi
  
  echo -e "\n${BOLD}${RED}Failed checks and their errors:${NC}"
  
  for i in "${!FAILED_STEPS[@]}"; do
    echo -e "\n${RED}======================================${NC}"
    echo -e "${RED}    Failed check: ${FAILED_STEPS[$i]}    ${NC}"
    echo -e "${RED}======================================${NC}"
    
    # Display the first 15 lines of the error log
    head -n 15 "${FAILED_LOGS[$i]}"
    
    # Check if there's more content and show a message
    if [ $(wc -l < "${FAILED_LOGS[$i]}") -gt 15 ]; then
      echo -e "\n${YELLOW}... (truncated) ...${NC}"
      echo -e "${YELLOW}Full log saved to: ${LOG_DIR}/${NC}"
    fi
    
    echo ""
  done
}

# Function to list recent error logs
list_error_logs() {
  if [ ! -d "$LOG_DIR" ] || [ -z "$(ls -A "$LOG_DIR")" ]; then
    echo -e "${YELLOW}No error logs found.${NC}"
    return 0
  fi
  
  echo -e "\n${BOLD}${BLUE}Recent error logs:${NC}"
  
  # List 10 most recent error logs
  local i=1
  local log_files=()
  
  while IFS= read -r log_file; do
    log_files+=("$log_file")
    # Extract step name and timestamp from filename
    local filename=$(basename "$log_file")
    local timestamp=$(echo "$filename" | cut -d'_' -f1-2)
    local step_name=$(echo "$filename" | cut -d'_' -f3- | sed 's/\.log$//' | tr '_' ' ')
    
    # Format timestamp for display
    local display_time=$(echo "$timestamp" | sed -E 's/([0-9]{8})_([0-9]{2})([0-9]{2})([0-9]{2})/\1 \2:\3:\4/')
    
    printf "${CYAN}%3d)${NC} %s - %s\n" $i "$display_time" "$step_name"
    i=$((i+1))
  done < <(ls -t "$LOG_DIR"/*.log 2>/dev/null | head -10)
  
  printf "${CYAN}%3d)${NC} %s\n" 0 "Exit"
  
  # Let user select a log to view
  local logs_selection=""
  while true; do
    read -rp "Enter choice [0-$((i-1))]: " logs_selection
    
    if [[ "$logs_selection" =~ ^[0-9]+$ ]] && [ "$logs_selection" -ge 0 ] && [ "$logs_selection" -lt "$i" ]; then
      break
    fi
    
    echo -e "${RED}Invalid selection. Please try again.${NC}"
  done
  
  if [ "$logs_selection" -eq 0 ]; then
    return 0
  fi
  
  # Get the selected log file using the array
  local selected_log="${log_files[$((logs_selection-1))]}"
  
  # Display the selected log
  clear
  local filename=$(basename "$selected_log")
  local step_name=$(echo "$filename" | cut -d'_' -f3- | sed 's/\.log$//' | tr '_' ' ')
  echo -e "${BOLD}${RED}=== Error log for: ${step_name} ===${NC}\n"
  cat "$selected_log"
  echo -e "\n${BOLD}${BLUE}Press Enter to return to menu...${NC}"
  read -r
  
  return 0
}

# Function to create conventional commit message
create_commit_message() {
  # Check if we're in a git repository
  if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e "${RED}Not in a git repository. Commit message creation skipped.${NC}"
    return 1
  fi
  
  # Only run if there are staged changes
  if git diff --cached --quiet; then
    echo -e "${YELLOW}No staged changes found. Commit message creation skipped.${NC}"
    return 0
  fi
  
  echo -e "\n${BLUE}======================================${NC}"
  echo -e "${BLUE}     INTERACTIVE COMMIT MESSAGE      ${NC}"
  echo -e "${BLUE}======================================${NC}"
  
  # Get commit message directly
  echo -e "\n${BOLD}${BLUE}Enter your commit message (or press Ctrl+C to cancel):${NC}"
  commit_short=""
  
  # Read input with a timeout to prevent hanging
  read -rp "> " commit_short
  
  # If empty after first attempt, give user option to exit
  if [ -z "$commit_short" ]; then
    echo -e "${YELLOW}No commit message entered.${NC}"
    echo -e "\n${BOLD}${BLUE}Do you want to try again? (Y/n):${NC}"
    read -r try_again
    
    if [[ "$try_again" =~ ^[Nn] ]]; then
      echo -e "${YELLOW}Commit message creation canceled.${NC}"
      return 1
    fi
    
    echo -e "\n${BOLD}${BLUE}Enter your commit message:${NC}"
    read -rp "> " commit_short
    
    # If still empty, cancel
    if [ -z "$commit_short" ]; then
      echo -e "${YELLOW}No commit message entered. Commit creation canceled.${NC}"
      return 1
    fi
  fi
  
  # Get detailed description (optional)
  echo -e "\n${BOLD}${BLUE}Enter a detailed description (optional, press enter to skip):${NC}"
  echo -e "${CYAN}(Press Ctrl+D when finished)${NC}"
  commit_body=$(cat)
  
  # Get breaking changes (optional)
  echo -e "\n${BOLD}${BLUE}Are there any breaking changes? (y/N):${NC}"
  read -r breaking_changes
  
  breaking_changes_text=""
  if [[ "$breaking_changes" =~ ^[Yy] ]]; then
    echo -e "${BOLD}${BLUE}Describe the breaking changes:${NC}"
    read -rp "> " breaking_changes_text
    breaking_changes_text="BREAKING CHANGE: $breaking_changes_text"
  fi
  
  # Get issues closed (optional)
  echo -e "\n${BOLD}${BLUE}Issues closed (optional, comma separated, press enter to skip):${NC}"
  read -rp "> " issues_closed
  
  issues_text=""
  if [ -n "$issues_closed" ]; then
    # Convert comma-separated issues to format: "Closes #123, Closes #456"
    issues_array=($(echo "$issues_closed" | tr ',' ' '))
    for issue in "${issues_array[@]}"; do
      # Remove any non-digit characters and format
      issue_num=$(echo "$issue" | tr -cd '0-9')
      if [ -n "$issue_num" ]; then
        if [ -n "$issues_text" ]; then
          issues_text="$issues_text, "
        fi
        issues_text="${issues_text}Closes #${issue_num}"
      fi
    done
  fi
  
  # Construct the commit message
  commit_message="${commit_short}"
  
  # Add body if provided
  if [ -n "$commit_body" ]; then
    commit_message="${commit_message}\n\n${commit_body}"
  fi
  
  # Add breaking changes if provided
  if [ -n "$breaking_changes_text" ]; then
    commit_message="${commit_message}\n\n${breaking_changes_text}"
  fi
  
  # Add issues closed if provided
  if [ -n "$issues_text" ]; then
    commit_message="${commit_message}\n\n${issues_text}"
  fi
  
  # Show the commit message and confirm
  echo -e "\n${BOLD}${BLUE}Your commit message:${NC}\n"
  echo -e "${YELLOW}$(echo -e "$commit_message" | sed 's/^/  /')${NC}"
  
  echo -e "\n${BOLD}${BLUE}Do you want to use this commit message? (Y/n):${NC}"
  read -r confirm
  
  if [[ ! "$confirm" =~ ^[Nn] ]]; then
    # Save to temporary file and use git commit with file
    commit_file="${TEMP_DIR}/commit_message.txt"
    echo -e "$commit_message" > "$commit_file"
    git commit -F "$commit_file"
    echo -e "\n${GREEN}Commit created successfully!${NC}"
    return 0
  else
    echo -e "\n${YELLOW}Commit message discarded.${NC}"
    return 1
  fi
}

# Function to cleanup temp files
cleanup() {
  rm -rf "$TEMP_DIR"
}

# Set trap to clean up on exit
trap cleanup EXIT

# Print header
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}      RUNNING PRE-COMMIT CHECKS      ${NC}"
echo -e "${BLUE}======================================${NC}"

# Check if user wants to view error logs
if [ "$1" = "--logs" ]; then
  list_error_logs
  exit 0
fi

# Define total number of steps
TOTAL_STEPS=5

# Run each check
run_step "typecheck" "pnpm typecheck" 1 $TOTAL_STEPS
typecheck_status=$?

run_step "lint" "pnpm lint" 2 $TOTAL_STEPS
lint_status=$?

run_step "format check" "pnpm format" 3 $TOTAL_STEPS
format_status=$?

run_step "build" "pnpm build" 4 $TOTAL_STEPS
build_status=$?

run_step "db check" "pnpm db:check" 5 $TOTAL_STEPS
db_status=$?

# Only create error summary if there are actually failed steps
if [ ${#FAILED_STEPS[@]} -gt 0 ]; then
  timestamp=$(date +"%Y%m%d_%H%M%S")
  error_summary="${LOG_DIR}/${timestamp}_error_summary.txt"
  
  echo "Error Summary ($(date))" > "$error_summary"
  echo "===========================================" >> "$error_summary"
  for i in "${!FAILED_STEPS[@]}"; do
    echo "Failed step: ${FAILED_STEPS[$i]}" >> "$error_summary"
    echo "------------------------------------------" >> "$error_summary"
    cat "${FAILED_LOGS[$i]}" >> "$error_summary"
    echo -e "\n\n" >> "$error_summary"
  done
  
  echo -e "${YELLOW}Error summary saved to ${error_summary}${NC}"

  # Show failed logs directly instead of interactive menu
  echo -e "\n${RED}======================================${NC}"
  echo -e "${RED}      SOME CHECKS FAILED!           ${NC}"
  echo -e "${RED}======================================${NC}"
  
  show_failed_logs
  
  echo -e "\n${YELLOW}To view detailed error logs later, run: ${CYAN}pnpm logs${NC}"
  
  # Exit with error code
  exit 1
else
  # All checks passed
  echo -e "\n${GREEN}======================================${NC}"
  echo -e "${GREEN}      ALL CHECKS PASSED! 🎉          ${NC}"
  echo -e "${GREEN}======================================${NC}"
  
  # Ask if the user wants to create a commit message
  echo -e "\n${BOLD}${BLUE}Do you want to create a commit message now? (Y/n):${NC}"
  read -r create_commit
  
  if [[ ! "$create_commit" =~ ^[Nn] ]]; then
    create_commit_message
  fi
  
  exit 0
fi 