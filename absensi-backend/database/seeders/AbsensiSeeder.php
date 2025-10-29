<?php

namespace Database\Seeders;

use App\Models\Absensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AbsensiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all karyawan users
        $karyawanUsers = User::whereHas('role', function ($query) {
            $query->where('name', 'karyawan');
        })->get();

        // Coordinates for office location (example: Jakarta)
        $officeLatitude = '-6.2088';
        $officeLongitude = '106.8456';

        // Generate absensi data for the last 30 days
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();

        $absensiData = [];

        foreach ($karyawanUsers as $user) {
            $currentDate = $startDate->copy();
            
            while ($currentDate <= $endDate) {
                // Skip weekends (Saturday and Sunday)
                if (!$currentDate->isWeekend()) {
                    // Random check-in time between 7:00 AM and 9:00 AM
                    $checkInHour = rand(7, 8);
                    $checkInMinute = rand(0, 59);
                    $checkInTime = $currentDate->copy()
                        ->setTime($checkInHour, $checkInMinute, 0);

                    // Random check-out time between 4:00 PM and 6:00 PM
                    $checkOutHour = rand(16, 17);
                    $checkOutMinute = rand(0, 59);
                    $checkOutTime = $currentDate->copy()
                        ->setTime($checkOutHour, $checkOutMinute, 0);

                    // Small random offset for coordinates (to simulate different locations)
                    $latOffset = (rand(-50, 50) / 10000); // ±0.005 degrees
                    $lngOffset = (rand(-50, 50) / 10000); // ±0.005 degrees

                    $absensiData[] = [
                        'employee_id' => $user->id,
                        'check_in_time' => $checkInTime,
                        'check_out_time' => $checkOutTime,
                        'latitude' => (string)($officeLatitude + $latOffset),
                        'longitude' => (string)($officeLongitude + $lngOffset),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                $currentDate->addDay();
            }
        }

        // Insert in chunks to avoid memory issues
        $chunks = array_chunk($absensiData, 100);
        foreach ($chunks as $chunk) {
            Absensi::insert($chunk);
        }

        // Create some pending check-ins for today (without check-out)
        $today = Carbon::today();
        foreach ($karyawanUsers->take(2) as $user) {
            $checkInTime = $today->copy()->setTime(rand(7, 8), rand(0, 59), 0);
            
            Absensi::create([
                'employee_id' => $user->id,
                'check_in_time' => $checkInTime,
                'check_out_time' => null,
                'latitude' => $officeLatitude,
                'longitude' => $officeLongitude,
            ]);
        }

        $this->command->info('Absensi data seeded successfully!');
        $this->command->info('Generated ' . count($absensiData) . ' absensi records for the last 30 days.');
    }
}