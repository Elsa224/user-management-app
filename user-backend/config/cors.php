<?php

// CORS configuration for Laravel application
return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // The paths that will be accessible via CORS
    'paths' => [
        'api/*',                // Allow all API routes
        'sanctum/csrf-cookie',  // Allow Sanctum CSRF cookie route
    ],

    // HTTP methods that are allowed for CORS requests
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Origins that are allowed to access the API
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'), // Allow frontend URL from environment or default to localhost
        'https://user-management-app-nv66.vercel.app',
        'https://app-service-production-6c11.up.railway.app'
        // Add other allowed origins if needed, e.g. 'https://another-frontend.com'
    ],

    // Patterns that can be used to allow origins using regular expressions
    'allowed_origins_patterns' => [
        // e.g. '/^https:\/\/.*\.example\.com$/'
        '/^https:\/\/.*\.user-management-app-nv66\.vercel\.app$/',
        '/^https:\/\/.*\.app-service-production-6c11\.up\.railway\.app$/',
    ],

    'allowed_headers' => [
        'Accept',
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'X-CSRF-TOKEN',
        'Origin',
    ],

    'exposed_headers' => [],

    'max_age' => 86400, // Cache preflight for 24 hours

    'supports_credentials' => true,
];