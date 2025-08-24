<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

Route::get('/', function () {
    return view('welcome');
});

// Serve storage files for Railway deployment
Route::get('/storage/{path}', function ($path) {
    // Security: Prevent path traversal attacks
    $path = str_replace(['../', '..\\', '../\\'], '', $path);
    $fullPath = storage_path('app/public/' . $path);
    
    // Check if file exists and is within allowed directory
    if (!file_exists($fullPath) || !str_starts_with(realpath($fullPath), realpath(storage_path('app/public')))) {
        abort(404);
    }
    
    // Check if it's actually a file
    if (!is_file($fullPath)) {
        abort(404);
    }
    
    $file = file_get_contents($fullPath);
    $type = mime_content_type($fullPath);
    
    return Response::make($file, 200, [
        'Content-Type' => $type,
        'Content-Length' => strlen($file),
        'Cache-Control' => 'public, max-age=31536000',
        'Access-Control-Allow-Origin' => env('FRONTEND_URL', '*'),
        'Access-Control-Allow-Methods' => 'GET',
        'Access-Control-Allow-Headers' => 'Origin, Content-Type, X-Auth-Token',
    ]);
})->where('path', '[a-zA-Z0-9/_.-]+');
