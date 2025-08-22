<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

// Return the authenticated user (requires Sanctum authentication)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication routes
// Login route: issues a JWT token on successful authentication
Route::post('/login', [AuthController::class, 'login']);

// Routes that require JWT authentication
Route::middleware('auth:api')->group(function () {
    // Logout route: invalidates the current JWT token
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Refresh route: issues a new JWT token
    Route::post('/refresh', [AuthController::class, 'refresh']);
    
    // Me route: returns the currently authenticated user's details
    Route::get('/me', [AuthController::class, 'me']);
    
    // Password management routes
    Route::post('/change-password', [AuthController::class, 'changePassword']);
});

// Password reset routes (public)
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/reset-password-confirm', [AuthController::class, 'resetPasswordConfirm']);

// User management routes (CRUD operations for users, protected by JWT)
Route::middleware('auth:api')->group(function () {
    // Uses 'slug' as the route parameter for user identification
    Route::apiResource('users', UserController::class)->parameters([
        'users' => 'slug'
    ]);
    
    // Additional user management routes
    Route::patch('/users/{slug}/status', [UserController::class, 'changeStatus']);
});