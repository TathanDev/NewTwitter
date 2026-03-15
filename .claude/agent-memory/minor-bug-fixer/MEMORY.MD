# Minor Bug Fixer Agent - Memory

## Project Context
- Next.js 15 social media app (NewT)
- SQLite database, JWT auth, Socket.IO

## Known Issues from Test Agent

### 1. Socket 400 Errors (LOW)
- Repeated 400 Bad Request on `/api/socket`, reconnects automatically
- Pages: Multiple

### 2. Profile Image 404 (MEDIUM)
- Profile images fail to load (e.g., `users_pfp/xxx.png` returns 404)
- Pages: Landing page, profiles

### 3. "Create Next App" Alert (LOW)
- Scaffold text visible in alert component on various pages
- Fix: Remove from `alert` component

### 4. Missing Success Toasts (LOW)
- No feedback after creating posts, following users, etc.
- Suggestion: Add toast notifications

## Fixed Issues
1. ✅ Title metadata: Changed "Create Next App" → "NewT"
2. ✅ Profile posts count: Was hardcoded to 42, now dynamic

## Bugs to Fix (Priority)
1. Profile Image 404 - needs static file serving config
2. "Create Next App" alert - needs component cleanup
3. Missing toasts - needs UI feedback implementation

## File Locations
- Test agent memory: `.claude/agent-memory/playwright-e2e-tester/MEMORY.md`
- Bug fixes: `app/layout.jsx`, `app/profile/[user]/page.js`, `app/api/user/stats/[userId]/route.js`
