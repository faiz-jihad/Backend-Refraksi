<?php

declare(strict_types=1);

namespace App\Helpers;

use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'Berhasil',
        int $code = 200
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    public static function error(
        string $message = 'Terjadi kesalahan',
        mixed $errors = null,
        int $code = 400
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $code);
    }

    public static function notFound(string $message = 'Data tidak ditemukan'): JsonResponse
    {
        return self::error($message, null, 404);
    }

    public static function unauthorized(string $message = 'Tidak terautentikasi'): JsonResponse
    {
        return self::error($message, null, 401);
    }

    public static function forbidden(string $message = 'Akses ditolak'): JsonResponse
    {
        return self::error($message, null, 403);
    }

    public static function serverError(string $message = 'Kesalahan server'): JsonResponse
    {
        return self::error($message, null, 500);
    }
}
