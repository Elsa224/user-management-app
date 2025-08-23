# User Management App - Frontend

A modern user management application frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: JWT-based login with token management
- **User Management**: CRUD operations with role-based access control
- **Internationalization**: English/French language support
- **Responsive Design**: Mobile-first approach with shadcn/ui components
- **Data Management**: TanStack Table with search and pagination
- **Theme Support**: Light/Dark mode with system preference detection
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Toast notifications with Sonner
- **Loading States**: Comprehensive loading overlays and skeletons

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm
- Running Laravel backend (see ../user-backend/README.md)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript check
```

## Project Structure

```
user-frontend/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   └── users/            # Users management page
├── components/           # Reusable components
│   ├── layout/          # Layout components
│   ├── ui/              # shadcn/ui components
│   ├── users/           # User-specific components
│   └── skeletons/       # Loading states
├── hooks/               # Custom React hooks
├── lib/                # Utility functions
├── messages/           # Translation files
│   ├── en.json         # English translations
│   └── fr.json         # French translations
├── services/           # API service layer
└── types/              # TypeScript type definitions
```

## Key Features

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes with middleware
- Role-based access control (Admin/User)

### User Management
- View paginated user list with search
- Add new users (Admin only)
- Edit user details (role-based permissions)
- Delete users (Admin only)
- Toggle user status (Admin only)

### Internationalization
- English and French language support
- Language switcher component
- Localized routing (e.g., `/login` → `/connexion`)
- Comprehensive translation coverage

### UI/UX
- Responsive design for all screen sizes
- Dark/Light theme support
- Loading states and skeletons
- Toast notifications for user feedback
- Professional design with Nunito font
- Amber-400 primary color scheme

## API Integration

The frontend integrates with the Laravel backend API:

- **Base URL**: http://127.0.0.1:8000/api
- **Authentication**: JWT Bearer tokens
- **Error Handling**: Comprehensive error responses
- **Loading States**: Request-specific loading indicators

### Demo Credentials

- **Admin**: admin@example.com / password123
- **User**: user@example.com / password123

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### Internationalization

- Default locale: French (fr) 
- Supported locales: English (en), French (fr)
- Language preference stored in localStorage
- Automatic locale detection based on user selection

## Development Notes

- Uses App Router with TypeScript
- Follows shadcn/ui design patterns
- Implements proper error boundaries
- Comprehensive form validation
- Optimistic updates for better UX
- Type-safe API calls with proper error handling

## Dependencies

### Core Dependencies
- next: 15.x
- react: 18.x
- typescript: 5.x
- tailwindcss: 3.x

### Key Libraries
- @tanstack/react-query: Data fetching and caching
- react-hook-form: Form management
- zod: Schema validation
- next-intl: Internationalization
- sonner: Toast notifications
- lucide-react: Icon library

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [next-intl](https://next-intl-docs.vercel.app/)
