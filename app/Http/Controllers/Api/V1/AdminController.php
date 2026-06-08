<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * Tampilkan daftar semua pengguna.
     */
    public function users(): JsonResponse
    {
        $users = User::latest()->get();
        return ApiResponse::success(
            $users,
            'Daftar pengguna berhasil diambil'
        );
    }
}
