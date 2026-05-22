# Statements App - Setup Guide

A modern note-taking application where users can create statements (words) with associations (meanings) and search through them.

## Features

✨ **Authentication**
- Sign up with email and password
- OTP verification during signup
- Login with email and password

📝 **Statement Management**
- Create new statements with associations
- Edit statements and their associations
- Delete statements
- View full statement details

🔍 **Search**
- Real-time search for statements
- Filter by statement text

🎨 **Modern UI**
- Dark theme with clean design
- Responsive layout
- Smooth interactions and transitions

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- pnpm (or npm/yarn)

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set your backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

## Project Structure

```
app/
├── auth/                           # Authentication pages
│   ├── login/page.tsx             # Login page
│   ├── signup/page.tsx            # Signup page
│   └── verify-otp/page.tsx        # OTP verification
├── dashboard/                      # Protected dashboard area
│   ├── page.tsx                   # Statement list
│   ├── new/page.tsx               # Create new statement
│   └── statement/[id]/page.tsx    # Statement detail & edit
├── layout.tsx                      # Root layout
├── page.tsx                        # Home/redirect
└── globals.css                     # Global styles

components/
├── dashboard-header.tsx            # Header with user menu
├── statement-editor.tsx            # Form for creating/editing
└── statement-list.tsx              # Statement cards list

lib/
├── auth-context.tsx               # Auth state management
└── api-client.ts                  # API service layer
```

## API Integration

The frontend expects the following API endpoints from your backend:

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/send-otp` - Send OTP email
- `POST /api/auth/verifyotp` - Verify OTP code
- `POST /api/auth/login` - Login with credentials

### Statements (Require Authentication)
- `GET /api/statements` - Get all statements
- `GET /api/statements/:id` - Get single statement
- `POST /api/statements` - Create statement
- `PUT /api/statements/:id` - Update statement
- `DELETE /api/statements/:id` - Delete statement
- `GET /api/statements/search?q=query` - Search statements

### Authentication Header
All protected endpoints expect an `Authorization: Bearer {token}` header.

## Development

### Hot Reload
The app supports hot module reloading. Changes to files will automatically refresh the browser.

### Building for Production
```bash
pnpm build
pnpm start
```

## Tech Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Token-based (localStorage)
- **HTTP Client**: Fetch API

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Notes

- The app stores the auth token in localStorage - suitable for web apps. For production, consider more secure storage options.
- OTP verification flow integrates with your backend's email service.
- Search functionality queries the backend directly.
