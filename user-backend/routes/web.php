<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

Route::get('/', function () {
    return view('welcome');
});

// Serve storage files for Railway deployment
Route::get('/storage/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);
    
    if (!file_exists($fullPath)) {
        abort(404);
    }
    
    $file = file_get_contents($fullPath);
    $type = mime_content_type($fullPath);
    
    return Response::make($file, 200, [
        'Content-Type' => $type,
        'Content-Length' => strlen($file),
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.*');
