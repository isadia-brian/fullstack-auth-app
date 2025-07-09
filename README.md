# FULL-Stack Authentication App

A complete authentication system built with Express 5 and Next.js 15, supporting both session-based and JWT-based authentication with cross-origin cookie handling.

## Features

- **Express 5 Backend** with modern ES modules
- **Next.js 15 Frontend** with App Router
- **Session-based authentication** with MongoDB
- **JWT-based authentication** with refresh tokens
- **Cross-origin cookie handling** for production
- **Security best practices** (CORS, rate limiting, helmet)
- **Responsive UI** with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+
- bun
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/isadia-brian/Full-Stack-Authentication-App.git
cd fullstack-auth-app
```

2. Install all dependencies:

```bash
npm run install:all
```

3. Set up environment variables:

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your configuration
```

4. Start development servers:

```bash
npm run dev
```

This will start:

- Backend server on http://localhost:5000
- Frontend server on http://localhost:3000
