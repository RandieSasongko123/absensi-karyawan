<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get roles
        $adminRole = Role::where('name', 'admin')->first();
        $managerRole = Role::where('name', 'manager')->first();
        $staffRole = Role::where('name', 'staff')->first();
        $karyawanRole = Role::where('name', 'karyawan')->first();

        // Admin users
        $adminUsers = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'System Administrator',
                'email' => 'sysadmin@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Manager users
        $managerUsers = [
            [
                'name' => 'Manager HRD',
                'email' => 'hrd@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $managerRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Manager IT',
                'email' => 'itmanager@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $managerRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Staff users
        $staffUsers = [
            [
                'name' => 'Staff HRD',
                'email' => 'hrstaff@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $staffRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Staff IT',
                'email' => 'itstaff@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $staffRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Karyawan users
        $karyawanUsers = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $karyawanRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Siti Rahayu',
                'email' => 'siti@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $karyawanRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $karyawanRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Maya Sari',
                'email' => 'maya@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $karyawanRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Rizki Pratama',
                'email' => 'rizki@absensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $karyawanRole->id,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert all users
        foreach ($adminUsers as $user) {
            User::create($user);
        }

        foreach ($managerUsers as $user) {
            User::create($user);
        }

        foreach ($staffUsers as $user) {
            User::create($user);
        }

        foreach ($karyawanUsers as $user) {
            User::create($user);
        }

        $this->command->info('Users seeded successfully!');
        $this->command->info('Admin Login: admin@absensi.com / password123');
        $this->command->info('Karyawan Login: budi@absensi.com / password123');
    }
}