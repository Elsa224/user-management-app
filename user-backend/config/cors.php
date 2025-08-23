<?php

// CORS configuration for Laravel application
return [
    // The paths that will be accessible via CORS
    'paths' => [
        'api/*',                // Allow all API routes
        'sanctum/csrf-cookie',  // Allow Sanctum CSRF cookie route
    ],

    // HTTP methods that are allowed for CORS requests
    'allowed_methods' => ['*'], // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)

    // Origins that are allowed to access the API
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'), // Allow frontend URL from environment or default to localhost
        // Add other allowed origins if needed, e.g. 'https://another-frontend.com'
    ],

    // Patterns that can be used to allow origins using regular expressions
    'allowed_origins_patterns' => [
        // e.g. '/^https:\/\/.*\.example\.com$/'
    ],

    // Headers that are allowed in CORS requests
    'allowed_headers' => ['*'], // Allow all headers

    // Headers that are exposed to the browser
    'exposed_headers' => [
        // e.g. 'Authorization', 'X-Custom-Header'
    ],

    // The maximum number of seconds the results of a preflight request can be cached
    'max_age' => 0, // 0 means no caching

    // Whether or not the response to the request can be exposed when the credentials flag is true
    'supports_credentials' => true, // Allow cookies and credentials to be sent
];