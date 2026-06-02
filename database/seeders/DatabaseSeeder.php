<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed default admin user
        User::query()->updateOrCreate(
            ['email' => 'admin@bytemart.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Seed default customer user
        User::query()->updateOrCreate(
            ['email' => 'customer@bytemart.com'],
            [
                'name' => 'Customer User',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'email_verified_at' => now(),
            ]
        );

        $this->call(CatalogSeeder::class);
    }
}
