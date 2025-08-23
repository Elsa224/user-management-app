# User Management Backend API 🔧

A robust **Laravel 12** backend API providing JWT authentication, user management, and activity logging for the User Management System.

![Laravel](https://img.shields.io/badge/Laravel-12-red?style=for-the-badge&logo=laravel)
![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?style=for-the-badge&logo=php)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## 🚀 Quick Start

### Prerequisites

-   PHP 8.4 or higher
-   Composer
-   MySQL 8.0+
-   Extensions: `openssl`, `pdo_mysql`, `mbstring`, `tokenizer`

### Installation

1. **Clone and navigate**

    ```bash
    git clone <repository-url>
    cd user-backend
    ```

2. **Install dependencies**

    ```bash
    composer install
    ```

3. **Environment setup**

    ```bash
    cp .env.example .env
    ```

4. **Configure environment**

    ```env
    APP_NAME="User Management API"
    APP_ENV=local
    APP_KEY=
    APP_DEBUG=true
    APP_URL=http://localhost:8000

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=user_backend
    DB_USERNAME=your_username
    DB_PASSWORD=your_password

    JWT_SECRET=
    ```

5. **Generate keys**

    ```bash
    php artisan key:generate
    php artisan jwt:secret
    ```

6. **Database setup**

    ```bash
    # Create database
    mysql -u root -p -e "CREATE DATABASE user_backend;"

    # Run migrations and seeders
    php artisan migrate --seed
    ```

7. **Start server**
    ```bash
    php artisan serve
    # API available at http://127.0.0.1:8000
    ```

## 🏗️ Architecture

### Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php      # Authentication endpoints
│   │   ├── UserController.php      # User CRUD operations
│   │   └── ActivityLogController.php # Activity logging
│   └── Requests/
│       ├── StoreUserRequest.php    # User creation validation
│       └── UpdateUserRequest.php   # User update validation
├── Models/
│   ├── User.php                    # User model with JWT auth
│   └── ActivityLog.php             # Activity logging model
└── Traits/
    └── ApiResponse.php             # Standardized API responses
```

### Key Components

#### 🔐 Authentication System

-   **JWT Integration**: Using `tymon/jwt-auth` package
-   **Token Management**: Login, logout, refresh, and validation
-   **Role-Based Access**: Admin vs User permissions
-   **Security**: Password hashing with bcrypt

#### 👥 User Management

-   **CRUD Operations**: Create, read, update, delete users
-   **Slug-Based Routing**: Secure user identification (USR_prefix)
-   **Search & Pagination**: Advanced filtering capabilities
-   **Status Management**: Active/inactive user states

#### 📊 Activity Logging

-   **Audit Trail**: Track all user actions
-   **Detailed Logging**: IP addresses, user agents, changes
-   **Admin Analytics**: View system-wide activity
-   **User History**: Individual user activity tracking

## 📡 API Documentation

### Base URL

```
Local: http://127.0.0.1:8000/api
Production: https://your-domain.railway.app/api
```

### Response Format

All API responses follow this standardized format:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {
        // Response data here
    }
}
```

### Authentication Endpoints

#### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "token_type": "bearer",
        "expires_in": 3600,
        "user": {
            "id": 1,
            "slug": "USR_64f8a1b2c3d4e",
            "name": "Admin User",
            "email": "admin@example.com",
            "role": "admin",
            "active": true
        }
    }
}
```

#### Get Current User

```http
GET /api/me
Authorization: Bearer <token>
```

#### Logout

```http
POST /api/logout
Authorization: Bearer <token>
```

### User Management Endpoints

#### List Users (Paginated)

```http
GET /api/users?page=1&per_page=10&search=john
Authorization: Bearer <token>
```

**Query Parameters:**

-   `page`: Page number (default: 1)
-   `per_page`: Items per page (default: 15)
-   `search`: Search term for name/email

#### Create User (Admin Only)

```http
POST /api/users
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "user",
  "active": true
}
```

#### Update User (Admin or Self)

```http
PUT /api/users/{slug}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin"
}
```

#### Delete User (Admin Only)

```http
DELETE /api/users/{slug}
Authorization: Bearer <admin-token>
```

### Activity Log Endpoints

#### Get All Activity Logs (Admin Only)

```http
GET /api/activity-logs?page=1&action=user_login&from_date=2024-01-01
Authorization: Bearer <admin-token>
```

#### Get My Activity Logs

```http
GET /api/my-activity-logs
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Activity Logs Table

```sql
CREATE TABLE activity_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(255) NULL,
    target_slug VARCHAR(255) NULL,
    changes JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_action_created (action, created_at),
    INDEX idx_target_slug (target_slug)
);
```

## 🛡️ Security Features

### Authentication Security

-   **JWT Tokens**: Stateless authentication
-   **Token Rotation**: Automatic refresh mechanism
-   **Bcrypt Hashing**: Secure password storage
-   **Role-Based Access**: Granular permission control

### API Security

-   **CORS Protection**: Configured for frontend domain
-   **Input Validation**: Laravel Form Requests
-   **SQL Injection Prevention**: Eloquent ORM
-   **Rate Limiting**: API throttling (configurable)

### Activity Monitoring

-   **Audit Logging**: All user actions tracked
-   **IP Tracking**: Security monitoring
-   **User Agent Logging**: Device/browser tracking
-   **Change Tracking**: Detailed modification logs

## 👥 Demo Credentials

### Admin User

-   **Email**: admin@example.com
-   **Password**: password123
-   **Permissions**: Full system access

### Regular User

-   **Email**: user@example.com
-   **Password**: password123
-   **Permissions**: Limited access

## 🚀 Production Deployment

### Railway Deployment

1. **Environment Setup**

    ```env
    APP_ENV=production
    APP_DEBUG=false
    APP_URL=https://your-app.railway.app
    ```

2. **Database Migration**

    ```bash
    php artisan migrate --force
    php artisan db:seed --force
    ```

3. **Optimization**
    ```bash
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    ```

## 🔍 Troubleshooting

### Common Issues

#### JWT Secret Not Set

```bash
php artisan jwt:secret
```

#### Database Connection Failed

-   Check database credentials in `.env`
-   Verify database server is running
-   Test connection: `php artisan tinker` then `DB::connection()->getPdo()`

#### CORS Issues

-   Update `config/cors.php` with frontend domain
-   Clear config cache: `php artisan config:clear`

### Logs

```bash
# View application logs
tail -f storage/logs/laravel.log
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built By [Elsa Z.](https://my-portfolio-tau-eight-59.vercel.app) with ❤️ using Laravel 12 and modern PHP practices**
