<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'slug' => 'USR_' . uniqid(),
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'active' => true,
        ]);

        // Create regular user
        User::create([
            'slug' => 'USR_' . uniqid(),
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
            'active' => true,
        ]);

        // Create some additional test users
        User::factory(8)->create();
    }
}
