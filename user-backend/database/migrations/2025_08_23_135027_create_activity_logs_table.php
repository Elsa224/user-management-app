<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // Use slug instead of id
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action'); // e.g., 'created_user', 'updated_user', 'deleted_user'
            $table->string('target_type')->nullable(); // e.g., 'User'
            $table->string('target_slug')->nullable(); // Slug of the target object
            $table->json('changes')->nullable(); // Store changes made
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            
            // Add indexes for better query performance
            $table->index(['user_id', 'created_at']);
            $table->index(['action', 'created_at']);
            $table->index('target_slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
