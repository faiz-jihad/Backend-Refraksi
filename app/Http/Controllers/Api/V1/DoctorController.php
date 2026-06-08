<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    /**
     * Ambil daftar dokter rujukan.
     */
    public function index(Request $request): JsonResponse
    {
        $doctors = Doctor::with('hospital')
            ->latest()
            ->get()
            ->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'specialization' => $doctor->specialization,
                    'phone' => $doctor->phone,
                    'schedule' => $doctor->schedule,
                    'hospital_name' => $doctor->hospital ? $doctor->hospital->name : null,
                    'hospital_address' => $doctor->hospital ? $doctor->hospital->address : null,
                    'created_at' => $doctor->created_at,
                ];
            });

        return ApiResponse::success(
            data: $doctors,
            message: 'Daftar dokter berhasil diambil'
        );
    }
}
