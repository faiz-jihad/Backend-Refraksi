<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    /**
     * Tampilkan profil pengguna yang sedang login.
     */
    public function show(Request $request): JsonResponse
    {
        return ApiResponse::success(
            data: new UserResource($request->user()),
            message: 'Profil berhasil diambil'
        );
    }

    /**
     * Update profil pengguna.
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Filter null values - only update fields that were actually sent
            $data = array_filter($request->validated(), fn($v) => !is_null($v));

            if (!empty($data)) {
                $this->userRepository->update($user->id, $data);
            }

            return ApiResponse::success(
                data: new UserResource($user->fresh()),
                message: 'Profil berhasil diperbarui'
            );
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Profile update failed', [
                'user_id' => $request->user()->id,
                'error'   => $e->getMessage(),
            ]);
            return ApiResponse::error('Gagal memperbarui profil: ' . $e->getMessage(), null, 500);
        }
    }

    /**
     * Update foto profil pengguna.
     */
    public function updateAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:2048'],
        ]);

        $user = $request->user();
        
        try {
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('avatars', 'public');
                
                $this->userRepository->update($user->id, [
                    'profile_picture' => $path
                ]);
            }

            return ApiResponse::success(
                data: new UserResource($user->fresh()),
                message: 'Foto profil berhasil diperbarui'
            );
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Avatar update failed', [
                'user_id' => $user->id,
                'error'   => $e->getMessage(),
            ]);
            return ApiResponse::error('Gagal memperbarui foto profil', null, 500);
        }
    }
}
