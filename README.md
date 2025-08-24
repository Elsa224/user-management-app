# User Management System 🚀

A comprehensive full-stack user management application built with **Next.js 15** and **Laravel 12**, featuring JWT authentication, role-based access control, and modern web technologies.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Laravel](https://img.shields.io/badge/Laravel-12-red?style=for-the-badge&logo=laravel)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql)

## ✨ Features

### 🔐 Authentication & Security

-   ✅ JWT token-based authentication
-   ✅ Role-based access control (Admin/User)
-   ✅ Protected routes and middleware
-   ✅ Password management (change, reset)
-   ✅ Secure cookie-based token storage
-   ✅ Activity logging and audit trails

### 👥 User Management

-   ✅ CRUD operations for users
-   ✅ Advanced search and filtering
-   ✅ Pagination with customizable page sizes
-   ✅ User status management (active/inactive)
-   ✅ Slug-based user identification for security
-   ✅ Real-time data tables with sorting

### 🎨 UI/UX & Bonus Features

-   ✅ Modern dashboard design inspired by shadcn/ui
-   ✅ **Dark/Light theme toggle** with system preference detection
-   ✅ **Responsive mobile-first design**
-   ✅ **Loading states and skeleton screens**
-   ✅ **Dynamic table filtering and sorting**
-   ✅ Advanced TanStack DataTable with column visibility
-   ✅ Nunito font with Amber-400 primary color
-   ✅ Internationalization (English/French)
-   ✅ Toast notifications with Sonner
-   ✅ Action logging system for user activity tracking

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
-   **Password**: password
-   **Permissions**: Full access to all features

### Regular User

-   **Email**: user@example.com
-   **Password**: password
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

### Activity Logs (Admin Only)

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| GET    | `/api/activity-logs`    | List all activity logs         |
| GET    | `/api/my-activity-logs` | List current user's activities |

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

activity_logs {
  id: bigint (primary key)
  slug: string (unique, LOG_prefix)
  user_id: bigint (foreign key)
  action: string (e.g., 'created_user', 'user_login')
  target_type: string (e.g., 'User')
  target_slug: string
  changes: json
  ip_address: string
  user_agent: string
  created_at: timestamp
  updated_at: timestamp
}
```

## 🚀 Deployment

### 🎯 Production Deployment

#### Backend (Railway)

1. **Create Railway Project**

    ```bash
    # Install Railway CLI
    npm install -g @railway/cli

    # Login and create project
    railway login
    railway init
    ```

2. **Set Environment Variables**

    ```env
    APP_ENV=production
    APP_DEBUG=false
    APP_URL=https://your-app-name.railway.app
    DB_CONNECTION=mysql
    # Railway provides DATABASE_URL automatically
    JWT_SECRET=your-secure-jwt-secret
    ```

3. **Deploy**
    ```bash
    railway up
    ```

#### Frontend (Vercel)

1. **Connect Repository**
    - Import project from GitHub
    - Set root directory to `user-frontend`
2. **Environment Variables**

    ```env
    NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
    ```

3. **Deploy**
    ```bash
    pnpm build
    vercel --prod
    ```

### 📊 Performance & Monitoring

-   **Backend**: Railway provides built-in monitoring
-   **Frontend**: Vercel Analytics and Core Web Vitals
-   **Database**: MySQL with Railway's automatic backups

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built By [Elsa Z.](https://my-portfolio-tau-eight-59.vercel.app) with ❤️ using modern web technologies**
