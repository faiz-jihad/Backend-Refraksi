<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get all public settings.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::where('group', 'general')->get(['key', 'value']);
        
        $data = [];
        foreach ($settings as $s) {
            $data[$s->key] = $s->value;
        }

        return ApiResponse::success(
            data: $data,
            message: 'Pengaturan berhasil diambil'
        );
    }

    /**
     * Get a specific setting by key.
     */
    public function show(string $key): JsonResponse
    {
        $value = Setting::getValue($key);
        
        if ($value === null) {
            return ApiResponse::notFound('Pengaturan tidak ditemukan');
        }

        return ApiResponse::success(
            data: ['key' => $key, 'value' => $value],
            message: 'Pengaturan berhasil diambil'
        );
    }

    /**
     * Update settings (Admin only).
     */
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'present',
        ]);

        foreach ($request->settings as $s) {
            Setting::updateOrCreate(
                ['key' => $s['key']],
                ['value' => $s['value']]
            );
        }

        return ApiResponse::success(
            data: null,
            message: 'Pengaturan berhasil diperbarui'
        );
    }
}
