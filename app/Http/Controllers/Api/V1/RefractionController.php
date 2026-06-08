<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Refraction\AnalyzeRefractionRequest;
use App\Http\Resources\RefractionResource;
use App\Services\Refraction\RefractionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RefractionController extends Controller
{
    public function __construct(
        private readonly RefractionService $refractionService
    ) {}

    /**
     * Analisis data refraksi mata pengguna menggunakan AI.
     */
    public function analyze(AnalyzeRefractionRequest $request): JsonResponse
    {
        $user = $request->user();
        
        // Rate Limiter: Maksimal 1000x per hari untuk role 'user' (Ditingkatkan untuk testing)
        if ($user->role === 'user') {
            $todayDetections = \App\Models\RefractionResult::where('user_id', $user->id)
                                ->whereDate('created_at', now()->toDateString())->count();
            
            if ($todayDetections >= 1000) {
                return ApiResponse::error('Batas harian Deteksi Mata (1000x/hari) telah tercapai. Silakan coba lagi besok.', null, 429);
            }
        }

        try {
            $result = $this->refractionService->analyze(
                userId: $request->user()->id,
                data: $request->validated()
            );

            return ApiResponse::success(
                data: $result,
                message: 'Analisis refraksi berhasil dilakukan'
            );

        } catch (\App\Exceptions\RefractionAnalysisException $e) {
            Log::error('RefractionAnalysisException', ['message' => $e->getMessage(), 'user_id' => $user->id]);
            return ApiResponse::error($e->getMessage(), null, 422);

        } catch (\App\Exceptions\GeminiException $e) {
            Log::error('GeminiException in analyze', ['message' => $e->getMessage()]);
            return ApiResponse::error('Layanan AI sedang tidak tersedia: ' . $e->getMessage(), null, 503);

        } catch (\Exception $e) {
            Log::error('Unexpected error in analyze', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return ApiResponse::error('Terjadi kesalahan server. Silakan coba lagi.', null, 500);
        }
    }

    /**
     * Ambil riwayat pemeriksaan refraksi mata pengguna.
     */
    public function history(Request $request): JsonResponse
    {
        try {
            $history = $this->refractionService->getHistory(
                userId: $request->user()->id,
                perPage: (int) $request->query('per_page', 10)
            );

            return ApiResponse::success(
                data: RefractionResource::collection($history)->response()->getData(true),
                message: 'Riwayat refraksi berhasil diambil'
            );
        } catch (\Exception $e) {
            Log::error('Failed to get refraction history', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal mengambil riwayat', null, 500);
        }
    }

    /**
     * Ambil detail pemeriksaan refraksi mata tertentu.
     */
    public function show($id): JsonResponse
    {
        try {
            $refraction = $this->refractionService->getDetail((int) $id);

            if (!$refraction || $refraction->user_id !== auth()->id()) {
                return ApiResponse::notFound('Data pemeriksaan tidak ditemukan');
            }

            return ApiResponse::success(
                data: new RefractionResource($refraction),
                message: 'Detail refraksi berhasil diambil'
            );
        } catch (\Exception $e) {
            Log::error('Failed to get refraction detail', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal mengambil detail', null, 500);
        }
    }

    /**
     * Prediksi kondisi mata berdasarkan gambar.
     */
    public function predict(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $user = $request->user();
        
        // Rate Limiter: Maksimal 1000x per hari untuk role 'user' (Ditingkatkan untuk testing)
        if ($user->role === 'user') {
            $todayDetections = \App\Models\RefractionResult::where('user_id', $user->id)
                                ->whereDate('created_at', now()->toDateString())->count();
            
            if ($todayDetections >= 1000) {
                return ApiResponse::error('Batas harian Prediksi AI (1000x/hari) telah tercapai. Silakan coba lagi besok.', null, 429);
            }
        }

        try {
            $imagePath = $request->file('image')->getRealPath();
            
            $prompt = "Anda adalah ahli oftalmologi AI MataCeria. Analisis gambar mata ini dan tentukan kondisi refraksi mata.
            Berikan output HANYA dalam format JSON valid berikut (tanpa markdown, tanpa teks lain):
            {\"predicted_class\": \"Normal|Rabun Jauh|Rabun Dekat|Silinder\", \"confidence\": 0.95, \"recommendation\": \"penjelasan ramah\", \"action_required\": true, \"can_consult_chatbot\": true, \"friendly_summary\": \"ringkasan 1-2 kalimat\"}";

            $analysis = $this->refractionService->analyzeByImage($imagePath, $prompt);

            return ApiResponse::success($analysis, 'Prediksi berhasil');
        } catch (\App\Exceptions\GeminiException $e) {
            Log::error('Prediction GeminiException', ['error' => $e->getMessage()]);
            return ApiResponse::error('Layanan AI tidak tersedia: ' . $e->getMessage(), null, 503);
        } catch (\Exception $e) {
            Log::error('Prediction failed', ['error' => $e->getMessage()]);
            return ApiResponse::error('Gagal memproses gambar', null, 500);
        }
    }
}
