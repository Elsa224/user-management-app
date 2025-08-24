<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/**
 * --------------------------------------------------------------------------
 * Public Routes
 * --------------------------------------------------------------------------
 */

// Health check route
Route::get('/health', function () {
    return response()->json(['status' => 'OK']);
});

// Handle preflight OPTIONS requests for all API routes
Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
        ->header('Access-Control-Allow-Credentials', 'true')
        ->header('Access-Control-Max-Age', '86400');
})->where('any', '.*');

// Return the authenticated user (requires Sanctum authentication)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // Registration (if enabled)
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/reset-password-confirm', [AuthController::class, 'resetPasswordConfirm']);

/**
 * --------------------------------------------------------------------------
 * Protected Routes (JWT Auth)
 * --------------------------------------------------------------------------
 */
Route::middleware('auth:api')->group(function () {

    /**
     * ----------------------------------------------------------------------
     * Auth & Session Management
     * ----------------------------------------------------------------------
     */
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    /**
     * ----------------------------------------------------------------------
     * User Management
     * ----------------------------------------------------------------------
     */
    // Change user status (activate/deactivate)
    Route::patch('/users/{slug}/status', [UserController::class, 'changeStatus']);
    // Bulk actions (example: bulk delete, bulk activate)
    Route::post('/users/bulk-action', [UserController::class, 'bulkAction']);
    
    // CRUD for users (uses 'slug' as identifier)
    Route::apiResource('users', UserController::class)->parameters([
        'users' => 'slug'
    ]);

    /**
     * ----------------------------------------------------------------------
     * Profile Management
     * ----------------------------------------------------------------------
     */
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::post('/profile/upload-photo', [UserController::class, 'uploadProfilePhoto']);
    Route::delete('/profile/delete-photo', [UserController::class, 'deleteProfilePhoto']);
    Route::post('/profile/change-password', [UserController::class, 'changePassword']);

    /**
     * ----------------------------------------------------------------------
     * Activity Logs
     * ----------------------------------------------------------------------
     */
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::get('/activity-logs/{id}', [ActivityLogController::class, 'show']);
    Route::get('/my-activity-logs', [ActivityLogController::class, 'myLogs']);
    Route::delete('/activity-logs/{id}', [ActivityLogController::class, 'destroy']);
    Route::delete('/activity-logs', [ActivityLogController::class, 'bulkDestroy']); // Bulk delete

    /**
     * ----------------------------------------------------------------------
     * Dashboard & Analytics
     * ----------------------------------------------------------------------
     */
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent-users', [DashboardController::class, 'recentUsers']);
    Route::get('/dashboard/user-activity-chart', [DashboardController::class, 'userActivityChart']);
    Route::get('/dashboard/active-sessions', [DashboardController::class, 'activeSessions']); // Example: active sessions
    Route::get('/dashboard/admin-users', [DashboardController::class, 'adminUsers']); // Example: admin users list

    /**
     * ----------------------------------------------------------------------
     * Settings (if needed)
     * ----------------------------------------------------------------------
     */
    // Route::get('/settings', [SettingsController::class, 'index']);
    // Route::put('/settings', [SettingsController::class, 'update']);
});

/**
 * --------------------------------------------------------------------------
 * Fallback Route
 * --------------------------------------------------------------------------
 */
Route::fallback(function () {
    return response()->json([
        'message' => 'API resource not found.'
    ], 404);
});