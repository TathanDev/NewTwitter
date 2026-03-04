# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (0.0.0.0:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:sync      # Sync database schema (node scripts/syncDatabase.js)
```

## Architecture Overview

This is a **Next.js 15 social media application** (microblogging platform like Twitter/X) with the following architecture:

### Tech Stack
- **Framework**: Next.js 15 (App Router), React 19 RC
- **Database**: SQLite3 with Sequelize ORM
- **Authentication**: JWT-based sessions (7-day expiry) using `jose` library, cookies
- **Styling**: Tailwind CSS
- **Real-time**: Socket.IO (server + client)
- **Validation**: Zod

### Project Structure

```
app/
├── actions/           # Server Actions (auth.js, post.js, postController.js)
├── api/              # REST API routes (auth, posts, comments, messages, etc.)
├── components/      # UI components (Navbar, Post, Comment, Modals, etc.)
├── context/          # React Context (UserContext)
├── entities/         # Sequelize models (User, Post, Comment, Message, etc.)
│
├── (pages)/
│   ├── homePage/    # Home feed
│   ├── messages/    # Direct messages
│   ├── notifications/
│   ├── profile/     # User profiles
│   ├── search/      # Search with autocomplete
│   └── settings/    # User settings

utils/
├── dal.js            # Data Access Layer (verifySession, getUser)
├── session.js        # JWT session management (encrypt, decrypt, createSession)
├── sequelize.js      # Database connection
└── ...
```

### Authentication Flow

1. **Login/Register**: Server actions in `app/actions/auth.js` create JWT sessions
2. **Session**: Stored in `session` cookie (httpOnly, 7-day expiry)
3. **Verification**: `utils/dal.js` provides `verifySession()` and `getUser()` cached functions
4. **Protection**: Server Actions and API routes check authentication via `verifySession()`

### Data Models (Sequelize)

- **User**: id_user, pseudo_user, mail_user, password_user, pfp_user, favorite_posts, allow_new_conversations
- **Post**: post_id, author, text, media, content_structure (JSON), style_config (JSON), likes (JSON array), comments (JSON array)
- **Comment**: Post comments with author, content, timestamp
- **Message**: Direct messages between users
- **Follow**: Follow relationships
- **Notification**: User notifications

### Key Patterns

1. **Server Components**: Default in App Router, use for data fetching
2. **Client Components**: Add "use client" directive for interactivity (onClick, useState, useEffect)
3. **Server Actions**: Mutations in `app/actions/` with "use server"
4. **API Routes**: REST endpoints in `app/api/`
5. **Environment**: Uses `envConfig.js` to load env vars for Next.js

### Database

- SQLite file: `db.sqlite`
- Models in `entities/` define schema
- `utils/sequelize.js` initializes connection and syncs on startup
