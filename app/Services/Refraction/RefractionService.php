<?php

declare(strict_types=1);

namespace App\Services\Refraction;

use App\Exceptions\RefractionAnalysisException;
use App\Repositories\Contracts\RefractionRepositoryInterface;
use App\Services\AI\GeminiService;
use Illuminate\Support\Facades\Log;
use App\Services\AI\OpenRouterService;

class RefractionService
{
    public function __construct(
        private readonly RefractionRepositoryInterface $refractionRepository,
        private readonly GeminiService $geminiService,
        private readonly \App\Services\AI\OpenRouterService $openRouterService
    ) {}

    /**
     * Orchestrate analisis refraksi: simpan data, panggil AI, return hasil.
     *
     * @throws RefractionAnalysisException
     */
    public function analyze(int $userId, array $data): array
    {
        try {
            // Handle Snellen Test Data (from Flutter AIRefractionTestScreen)
            if (isset($data['snellen_data'])) {
                $snellenData  = $data['snellen_data'];
                $imageBase64  = $data['image'] ?? null;

                // Compute visual_acuity from Snellen data
                $smallestRow = $snellenData['smallest_row_read'] ?? 200;
                $smallestN   = $snellenData['smallest_n_point'] ?? 12;
                $testType    = $snellenData['test_type'] ?? 'distance';

                if ($testType === 'near') {
                    $visualAcuity = "N{$smallestN}";
                } elseif ($testType === 'comprehensive') {
                    $visualAcuity = "20/{$smallestRow} / N{$smallestN}";
                } else {
                    $visualAcuity = "20/{$smallestRow}";
                }

                // Call AI
                // Call AI (Menggunakan Mock jika USE_MOCK_AI = true agar hemat kuota)
                // Hitung estimasi minus berdasarkan baris terkecil yang terbaca
                $estimateMinus = 0.0;
                if ($smallestRow > 20) {
                    $estimateMinus = -($smallestRow / 100); // Estimasi kasar
                }

                $smartMock = [
                    'visual_acuity' => $visualAcuity,
                    'status' => $smallestRow <= 20 ? 'Normal' : 'Abnormal (Indikasi Rabun Jauh)',
                    'description' => $smallestRow <= 20 
                        ? 'Penglihatan Anda normal. Anda dapat membaca baris 20/20 dengan baik.' 
                        : "Anda terindikasi mengalami Myopia (Rabun Jauh) karena hanya bisa membaca sampai baris 20/{$smallestRow}.",
                    'recommendations' => [
                        $smallestRow <= 20 
                            ? 'Pertahankan kesehatan mata Anda.' 
                            : "Disarankan menggunakan kacamata dengan estimasi ukuran sekitar {$estimateMinus} Diopter.",
                        'Konsultasikan dengan dokter spesialis mata untuk pemeriksaan refraksi yang lebih akurat.',
                    ],
                    'mock_mode' => true,
                ];

                if (env('USE_MOCK_AI', false)) {
                    $aiResult = $smartMock;
                } else {
                    try {
                        $aiResult = $this->geminiService->analyzeSnellen($snellenData, $imageBase64);
                    } catch (\Exception $e) {
                        // Try OpenRouter fallback
                        try {
                            $aiResult = $this->openRouterService->analyzeSnellen($snellenData, $imageBase64);
                        } catch (\Exception $e2) {
                            $aiResult = $smartMock;
                            $aiResult['description'] = "🤖 [MOCK MODE - API LIMIT] " . $smartMock['description'];
                            $aiResult['error'] = $e->getMessage();
                        }
                    }
                }

                // Save to DB
                $refraction = $this->refractionRepository->create([
                    'user_id'            => $userId,
                    'right_eye_sphere'   => 0.0,
                    'left_eye_sphere'    => 0.0,
                    'visual_acuity'      => $aiResult['visual_acuity'] ?? $visualAcuity,
                    'ai_recommendations' => $aiResult,
                ]);

                return array_merge($refraction->toArray(), ['ai_analysis' => $aiResult]);
            }

            // Handle Manual Input Format
            $refraction = $this->refractionRepository->create([
                'user_id'            => $userId,
                'right_eye_sphere'   => $data['right_eye_sphere'],
                'left_eye_sphere'    => $data['left_eye_sphere'],
                'right_eye_cylinder' => $data['right_eye_cylinder'] ?? null,
                'left_eye_cylinder'  => $data['left_eye_cylinder'] ?? null,
                'visual_acuity'      => $data['visual_acuity'],
            ]);

            // Dapatkan rekomendasi AI (Menggunakan Mock jika USE_MOCK_AI = true)
            $rightSphere = $data['right_eye_sphere'] ?? 0;
            $leftSphere = $data['left_eye_sphere'] ?? 0;
            $rightCyl = $data['right_eye_cylinder'] ?? 0;
            $leftCyl = $data['left_eye_cylinder'] ?? 0;

            $conditions = [];
            if ($rightSphere < 0 || $leftSphere < 0) $conditions[] = "Rabun Jauh (Miopia)";
            if ($rightSphere > 0 || $leftSphere > 0) $conditions[] = "Rabun Dekat (Hipermetropia)";
            if ($rightCyl < 0 || $leftCyl < 0) $conditions[] = "Silinder (Astigmatisme)";

            $status = empty($conditions) ? "Normal" : implode(" & ", $conditions);
            $desc = empty($conditions) 
                ? "Hasil pemeriksaan mata Anda menunjukkan kondisi normal." 
                : "Berdasarkan data input, Anda terindikasi mengalami " . implode(" dan ", $conditions) . ".";

            $smartMock = [
                'status' => $status,
                'description' => $desc,
                'recommendations' => [
                    'Gunakan kacamata sesuai dengan resep yang tertera.',
                    'Lakukan kontrol rutin ke dokter mata setiap 6-12 bulan.',
                ],
                'mock_mode' => true,
            ];

            if (env('USE_MOCK_AI', false)) {
                $aiResult = $smartMock;
            } else {
                try {
                    $aiResult = $this->geminiService->analyzeRefraction($refraction->toArray());
                } catch (\Exception $e) {
                    // Try OpenRouter fallback
                    try {
                        $aiResult = $this->openRouterService->analyzeRefraction($refraction->toArray());
                    } catch (\Exception $e2) {
                        $aiResult = $smartMock;
                        $aiResult['description'] = "🤖 [MOCK MODE - API LIMIT] " . $smartMock['description'];
                        $aiResult['error'] = $e->getMessage();
                    }
                }
            }

            // Update dengan hasil AI
            $this->refractionRepository->updateAiResult($refraction->id, $aiResult);

            return array_merge($refraction->fresh()->toArray(), ['ai_analysis' => $aiResult]);

        } catch (\Exception $e) {
            Log::error('Refraction analysis failed', [
                'user_id' => $userId,
                'payload' => $data,
                'error'   => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);

            throw new RefractionAnalysisException(
                message: 'Analisis tidak dapat diselesaikan: ' . $e->getMessage(),
                previous: $e
            );
        }
    }

    public function getHistory(int $userId, int $perPage = 10)
    {
        return $this->refractionRepository->findByUser($userId, $perPage);
    }

    public function getDetail(int $id)
    {
        return $this->refractionRepository->findById($id);
    }

    /**
     * Analisis kondisi mata via gambar menggunakan AI.
     */
    public function analyzeByImage(string $imagePath, string $prompt): array
    {
        return $this->geminiService->analyzeImage($imagePath, $prompt);
    }
}
