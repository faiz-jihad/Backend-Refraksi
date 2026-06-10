<?php

declare(strict_types=1);

namespace App\Services\Refraction;

use App\Exceptions\RefractionAnalysisException;
use App\Repositories\Contracts\RefractionRepositoryInterface;
use App\Services\AI\GeminiService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
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
                // Estimate sphere based on test results to populate right_eye_sphere and left_eye_sphere
                $estimatedSphere = 0.0;
                if ($testType === 'near') {
                    if ($smallestN >= 6) {
                        $estimatedSphere = match ($smallestN) {
                            6 => 1.00,
                            8 => 1.50,
                            10 => 2.00,
                            12 => 2.50,
                            default => $smallestN >= 12 ? 2.50 : 1.00,
                        };
                    }
                } else { // 'distance' or 'comprehensive'
                    if ($smallestRow > 20) {
                        if ($smallestRow <= 25) {
                            $estimatedSphere = -0.37;
                        } elseif ($smallestRow <= 30) {
                            $estimatedSphere = -0.75;
                        } elseif ($smallestRow <= 40) {
                            $estimatedSphere = -1.25;
                        } elseif ($smallestRow <= 60) {
                            $estimatedSphere = -1.75;
                        } elseif ($smallestRow <= 80) {
                            $estimatedSphere = -2.25;
                        } elseif ($smallestRow <= 100) {
                            $estimatedSphere = -3.00;
                        } else {
                            $estimatedSphere = -4.00;
                        }
                    } elseif ($testType === 'comprehensive' && $smallestN >= 6) {
                        $estimatedSphere = match ($smallestN) {
                            6 => 1.00,
                            8 => 1.50,
                            10 => 2.00,
                            12 => 2.50,
                            default => $smallestN >= 12 ? 2.50 : 1.00,
                        };
                    }
                }

                $estimatedCylinder = null;
                if ($snellenData['astigmatism_found'] ?? false) {
                    $estimatedCylinder = -0.50; // Mild starting astigmatism estimate
                }

                $isNormal = $estimatedSphere === 0.0 && $estimatedCylinder === null;
                $predictedClass = 'Normal';
                $recommendation = 'Penglihatan Anda normal. Anda dapat membaca baris 20/20 dengan baik. Pertahankan kesehatan mata Anda.';
                $friendlySummary = 'Mata kamu sehat dan normal!';

                if ($testType === 'near') {
                    if ($smallestN >= 8) {
                        $predictedClass = 'Rabun Dekat';
                        $recommendation = "Anda terindikasi mengalami Presbiopi/Hipermetropi (Rabun Dekat) karena batas membaca terkecil Anda adalah N{$smallestN}, dengan estimasi kebutuhan lensa baca sekitar +{$estimatedSphere} Diopter. Disarankan melakukan pemeriksaan lebih lanjut untuk ukuran kacamata baca Anda.";
                        $friendlySummary = "Hasil tes menunjukkan kamu kemungkinan mengalami rabun dekat (Presbiopi) dengan perkiraan ukuran +{$estimatedSphere}. Yuk periksa lebih lanjut!";
                    }
                } elseif ($testType === 'distance') {
                    if ($smallestRow > 20) {
                        $predictedClass = 'Rabun Jauh';
                        $recommendation = "Anda terindikasi mengalami Myopia (Rabun Jauh) karena hanya bisa membaca sampai baris 20/{$smallestRow}. Disarankan menggunakan kacamata dengan estimasi ukuran sekitar " . number_format($estimatedSphere, 2) . " Diopter. Konsultasikan dengan dokter spesialis mata untuk pemeriksaan refraksi yang lebih akurat.";
                        $friendlySummary = "Hasil tes menunjukkan kamu kemungkinan mengalami rabun jauh (Miopi) dengan perkiraan ukuran " . number_format($estimatedSphere, 2) . ". Yuk periksa lebih lanjut!";
                    }
                } else {
                    $conditionsList = [];
                    if ($smallestRow > 20) {
                        $conditionsList[] = 'Rabun Jauh';
                    }
                    if ($smallestN >= 8) {
                        $conditionsList[] = 'Rabun Dekat';
                    }
                    
                    if (!empty($conditionsList)) {
                        $predictedClass = implode(' & ', $conditionsList);
                        $recommendation = "Hasil tes komprehensif Anda menunjukkan adanya indikasi " . implode(' dan ', $conditionsList) . ". Silakan periksakan ke dokter spesialis mata untuk diagnosa lengkap.";
                        $friendlySummary = "Hasil tes menunjukkan kamu mengalami kelainan refraksi (" . implode(' & ', $conditionsList) . "). Yuk periksa ke ahlinya!";
                    }
                }

                if ($snellenData['astigmatism_found'] ?? false) {
                    if ($predictedClass === 'Normal') {
                        $predictedClass = 'Silinder';
                        $recommendation = "Anda terindikasi mengalami Astigmatisme (Silinder). Disarankan melakukan pemeriksaan ke dokter mata untuk mendapatkan lensa silinder.";
                        $friendlySummary = "Hasil tes menunjukkan mata kamu terindikasi silinder. Yuk periksa lebih lanjut!";
                    } else {
                        $predictedClass .= ' & Silinder';
                        $recommendation .= " Serta terindikasi kelainan silinder (Astigmatisme).";
                        $friendlySummary = "Hasil tes menunjukkan mata kamu terindikasi " . $predictedClass . ". Yuk periksa lebih lanjut!";
                    }
                }

                $smartMock = [
                    'predicted_class'     => $predictedClass,
                    'confidence'          => 0.70,
                    'visual_acuity'       => $visualAcuity,
                    'snellen_decimal'     => $smallestRow > 0 ? round(20 / $smallestRow, 2) : 1.0,
                    'recommendation'      => $recommendation,
                    'friendly_summary'    => $friendlySummary,
                    'action_required'     => !$isNormal,
                    'can_consult_chatbot' => true,
                    'mock_mode'           => true,
                ];

                if (env('USE_MOCK_AI', false)) {
                    $aiResult = $smartMock;
                } else {
                    $cacheKey = 'snellen_analysis_' . md5(json_encode($snellenData) . ($imageBase64 ? md5($imageBase64) : ''));
                    try {
                        $aiResult = Cache::remember($cacheKey, 86400, function () use ($snellenData, $imageBase64) {
                            try {
                                return $this->geminiService->analyzeSnellen($snellenData, $imageBase64);
                            } catch (\Exception $e) {
                                // Try OpenRouter fallback
                                return $this->openRouterService->analyzeSnellen($snellenData, $imageBase64);
                            }
                        });
                    } catch (\Exception $e) {
                        $aiResult = $smartMock;
                        $aiResult['recommendation'] = "🤖 [MOCK MODE - API LIMIT] " . $smartMock['recommendation'];
                        $aiResult['error'] = $e->getMessage();
                    }
                }

                // Save to DB
                $refraction = $this->refractionRepository->create([
                    'user_id'            => $userId,
                    'right_eye_sphere'   => $estimatedSphere,
                    'left_eye_sphere'    => $estimatedSphere,
                    'right_eye_cylinder' => $estimatedCylinder,
                    'left_eye_cylinder'  => $estimatedCylinder,
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
            if ($rightSphere < 0 || $leftSphere < 0) $conditions[] = "Rabun Jauh (Miopi)";
            if ($rightSphere > 0 || $leftSphere > 0) $conditions[] = "Rabun Dekat (Hipermetropia)";
            if ($rightCyl < 0 || $leftCyl < 0) $conditions[] = "Silinder (Astigmatisme)";

            $status = empty($conditions) ? "Normal" : implode(" & ", $conditions);
            $desc = empty($conditions) 
                ? "Hasil pemeriksaan mata Anda menunjukkan kondisi normal." 
                : "Berdasarkan data input, Anda terindikasi mengalami " . implode(" dan ", $conditions) . ".";

            $smartMock = [
                'predicted_class'     => $status,
                'confidence'          => 1.0,
                'visual_acuity'       => $data['visual_acuity'],
                'snellen_decimal'     => null,
                'recommendation'      => $desc . ' Gunakan kacamata sesuai dengan resep yang tertera. Lakukan kontrol rutin ke dokter mata setiap 6-12 bulan.',
                'friendly_summary'    => $desc,
                'action_required'     => $status !== 'Normal',
                'can_consult_chatbot' => true,
                'mock_mode'           => true,
            ];

            if (env('USE_MOCK_AI', false)) {
                $aiResult = $smartMock;
            } else {
                // Exclude auto-incrementing/volatile fields like id, created_at, updated_at from cache key
                $cacheData = [
                    'right_eye_sphere' => $refraction->right_eye_sphere,
                    'left_eye_sphere' => $refraction->left_eye_sphere,
                    'right_eye_cylinder' => $refraction->right_eye_cylinder,
                    'left_eye_cylinder' => $refraction->left_eye_cylinder,
                    'visual_acuity' => $refraction->visual_acuity,
                ];
                $cacheKey = 'refraction_analysis_' . md5(json_encode($cacheData));
                try {
                    $aiResult = Cache::remember($cacheKey, 86400, function () use ($refraction) {
                        try {
                            return $this->geminiService->analyzeRefraction($refraction->toArray());
                        } catch (\Exception $e) {
                            // Try OpenRouter fallback
                            return $this->openRouterService->analyzeRefraction($refraction->toArray());
                        }
                    });
                } catch (\Exception $e) {
                    $aiResult = $smartMock;
                    $aiResult['recommendation'] = "🤖 [MOCK MODE - API LIMIT] " . $smartMock['recommendation'];
                    $aiResult['error'] = $e->getMessage();
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
