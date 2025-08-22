# User Management System

A comprehensive full-stack user management application with JWT authentication, role-based access control, and modern web technologies.

## 🌟 Features

### Authentication & Security

-   ✅ JWT token-based authentication
-   ✅ Role-based access control (Admin/User)
-   ✅ Protected routes and middleware
-   ✅ Password management (change, reset)
-   ✅ Secure cookie-based token storage

### User Management

-   ✅ CRUD operations for users
-   ✅ Search and pagination functionality
-   ✅ User status management (active/inactive)
-   ✅ Slug-based user identification
-   ✅ Real-time data tables with sorting

### UI/UX

-   ✅ Modern dashboard design inspired by shadcn/ui
-   ✅ Responsive mobile-first design
-   ✅ TanStack DataTable with advanced features
-   ✅ Nunito font with Amber-400 primary color
-   ✅ Internationalization (English/French)
-   ✅ Loading states and error handling

## 🛠️ Tech Stack

### Frontend

-   **Framework**: Next.js 15 with App Router
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4
-   **State Management**: TanStack React Query
-   **Forms**: React Hook Form with Zod validation
-   **UI Components**: Radix UI primitives
-   **Internationalization**: next-intl
-   **Icons**: Lucide React

### Backend

-   **Framework**: Laravel 12+
-   **Language**: PHP 8.4+
-   **Database**: MySQL
-   **Authentication**: JWT (tymon/jwt-auth)
-   **API**: RESTful API with standardized responses
-   **Validation**: Laravel Form Requests
-   **Architecture**: Repository pattern with traits

## 📁 Project Structure

```
user-management-app/
├── user-frontend/          # Next.js Frontend
│   ├── app/                # App Router pages
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utilities and API client
│   ├── messages/           # Internationalization files
│   └── i18n/               # i18n configuration
│
├── user-backend/           # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/   # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   └── Traits/            # Reusable traits
│   ├── database/
│   │   ├── migrations/        # Database migrations
│   │   └── seeders/          # Database seeders
│   └── routes/               # API routes
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

-   PHP 8.4+
-   Composer
-   Node.js 18+
-   pnpm
-   MySQL

### Backend Setup

1. **Navigate to backend directory**

    ```bash
    cd user-backend
    ```

2. **Install dependencies**

    ```bash
    composer install
    ```

3. **Environment configuration**

    ```bash
    cp .env.example .env
    # Edit .env with your database credentials
    ```

4. **Generate application key**

    ```bash
    php artisan key:generate
    ```

5. **Generate JWT secret**

    ```bash
    php artisan jwt:secret
    ```

6. **Run migrations and seeders**

    ```bash
    php artisan migrate --seed
    ```

7. **Start the development server**
    ```bash
    php artisan serve
    ```
    Backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**

    ```bash
    cd user-frontend
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Environment configuration**

    ```bash
    # Create .env.development file
    echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api" > .env.development
    ```

4. **Start the development server**
    ```bash
    pnpm dev
    ```
    Frontend will be available at `http://localhost:3000`

## 👥 Demo Credentials

### Admin User

-   **Email**: admin@example.com
-   **Password**: password123
-   **Permissions**: Full access to all features

### Regular User

-   **Email**: user@example.com
-   **Password**: password123
-   **Permissions**: Limited access

## 📡 API Endpoints

### Authentication

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | `/api/login`   | User login        |
| POST   | `/api/logout`  | User logout       |
| POST   | `/api/refresh` | Refresh JWT token |
| GET    | `/api/me`      | Get current user  |

### User Management

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| GET    | `/api/users`               | List users (paginated)          |
| POST   | `/api/users`               | Create user (Admin only)        |
| GET    | `/api/users/{slug}`        | Get specific user               |
| PUT    | `/api/users/{slug}`        | Update user (Admin only)        |
| DELETE | `/api/users/{slug}`        | Delete user (Admin only)        |
| PATCH  | `/api/users/{slug}/status` | Toggle user status (Admin only) |

### Password Management

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| POST   | `/api/change-password`        | Change password        |
| POST   | `/api/reset-password`         | Send reset email       |
| POST   | `/api/reset-password-confirm` | Confirm password reset |

## 🎨 Design System

### Colors

-   **Primary**: Amber-400 (#fbbf24)
-   **Background**: White/Dark based on theme
-   **Text**: Slate-900/Slate-100 based on theme

### Typography

-   **Font Family**: Nunito
-   **Weights**: 400, 500, 600, 700

### Components

-   Built with Radix UI primitives
-   Consistent spacing and sizing
-   Accessible by default
-   Dark mode support

## 🌍 Internationalization

The application supports multiple languages:

-   **English** (default)
-   **French**

Language switching is available in the UI, and translations are stored in JSON files.

## 🔒 Security Features

### Backend Security

-   JWT token authentication
-   Password hashing with bcrypt
-   CORS configuration
-   Rate limiting
-   Input validation and sanitization
-   SQL injection prevention

### Frontend Security

-   Secure cookie storage
-   Protected routes
-   XSS prevention
-   CSRF protection
-   Automatic token refresh


## 🧪 Development

### Code Style

-   **Database**: Laravel naming conventions
-   **API**: RESTful principles

### Database Schema

```sql
users {
  id: bigint (primary key)
  slug: string (unique, USR_prefix)
  name: string
  email: string (unique)
  password: string (hashed)
  role: enum('admin', 'user')
  active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Build the application
pnpm build

# Deploy to Vercel
vercel --prod
```

### Backend (Railway)

```bash
# Connect your repository to Railway
# Set environment variables
# Deploy automatically on push
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built By [Elsa Z.](https://my-portfolio-tau-eight-59.vercel.app) with ❤️ using modern web technologies**
