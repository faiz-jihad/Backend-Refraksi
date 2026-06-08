<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $doctors = [
            [
                'name' => 'Dr. Andi Pratama, Sp.M',
                'specialization' => 'Spesialis Mata (Oftalmologi)',
                'phone' => '081234567890',
                'schedule' => 'Senin - Jumat, 09:00 - 15:00',
            ],
            [
                'name' => 'Dr. Rina Wijaya, Sp.M',
                'specialization' => 'Spesialis Mata (Retina)',
                'phone' => '081234567891',
                'schedule' => 'Senin - Rabu, 13:00 - 17:00',
            ],
            [
                'name' => 'Dr. Budi Santoso, Sp.M',
                'specialization' => 'Spesialis Mata (Glaukoma)',
                'phone' => '081234567892',
                'schedule' => 'Selasa & Kamis, 08:00 - 12:00',
            ],
        ];

        foreach ($doctors as $doctor) {
            Doctor::updateOrCreate(['name' => $doctor['name']], $doctor);
        }
    }
}
