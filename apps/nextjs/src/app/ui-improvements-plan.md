# UI Improvements Plan

## Overview

We need to make several UI improvements to enhance the user experience:

1. Fix breadcrumbs in the dashboard layout
2. Fix overflowing texts in the sidebar navigation
3. Move the sidebar trigger button and drawer to the right side
4. Improve the CRM table layout and interaction

## Step 1: Fix Breadcrumbs

- [ ] Analyze current breadcrumb implementation in `index.tsx`
- [ ] Update breadcrumb structure for better navigation
- [ ] Ensure breadcrumbs reflect current page location
- [ ] Test breadcrumbs on different pages

## Step 2: Fix Overflowing Texts in Sidebar

- [ ] Identify text overflow issues in `sidebar-nav.tsx`
- [ ] Apply proper text truncation or wrapping
- [ ] Ensure consistent spacing and padding
- [ ] Test sidebar navigation with long item names

## Step 3: Move Sidebar Trigger to Right Side

- [ ] Analyze current sidebar trigger position in `layout.tsx`
- [ ] Move sidebar trigger button to the right side of the header
- [ ] Update sheet/drawer to open from the right side
- [ ] Ensure proper mobile responsiveness

## Step 4: Improve CRM Table

- [ ] Remove padding/margins around the CRM table
- [ ] Remove action buttons from the table rows
- [ ] Make entire rows clickable
- [ ] Create a sliding panel/window (not a modal) that:
  - [ ] Fills space to the right of sidebar
  - [ ] Doesn't darken the background
  - [ ] Allows interaction with elements outside
  - [ ] Shows detailed information about the selected item
- [ ] Implement close functionality for the panel
- [ ] Test the interaction on different screen sizes

## Progress Tracking

We'll update this file as we complete each task to keep track of our progress.
