<?php

declare(strict_types=1);

namespace App\Services\AI;

use App\Exceptions\GeminiException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

class OpenRouterService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;
    private int $maxRetries;
    private int $retryDelay;

    public function __construct()
    {
        $this->apiKey     = (string) (config('services.openrouter.api_key') ?? '');
        $this->model      = (string) (config('services.openrouter.model') ?? 'openrouter/free');
        $this->baseUrl    = rtrim((string) (config('services.openrouter.base_url') ?? 'https://openrouter.ai/api/v1'), '/');
        $this->maxRetries = (int)    (config('services.openrouter.max_retries') ?? 3);
        $this->retryDelay = (int)    (config('services.openrouter.retry_delay') ?? 1000);
    }

    /**
     * Validate configuration.
     */
    private function validateConfiguration(): void
    {
        if (empty($this->apiKey)) {
            throw new GeminiException('OpenRouter API key tidak dikonfigurasi. Silakan set OPENROUTER_API_KEY di .env');
        }
        if (empty($this->model)) {
            throw new GeminiException('Model OpenRouter tidak dikonfigurasi');
        }
    }

    /**
     * Analyze refraction data using OpenRouter.
     */
    public function analyzeRefraction(array $refractionData): array
    {
        $prompt = $this->buildRefractionPrompt($refractionData);
        $raw = $this->makeRequest($prompt);
        return $this->parseJsonResponse($raw);
    }

    /**
     * Analyze Snellen test data using OpenRouter.
     */
    public function analyzeSnellen(array $snellenData, ?string $imageBase64 = null): array
    {
        $prompt = $this->buildSnellenPrompt($snellenData);
        // OpenRouter does not support multimodal images directly; we ignore $imageBase64 for now.
        $raw = $this->makeRequest($prompt);
        return $this->parseJsonResponse($raw);
    }

    /**
     * Chat menggunakan OpenRouter.
     */
    public function chat(string $message, array $history = []): string
    {
        $this->validateConfiguration();
        
        $messages = [
            [
                'role'    => 'system',
                'content' => "Anda adalah 'MataCeria AI', asisten kesehatan mata yang ramah, profesional, dan empatik.\n\n" .
                             "BAHASA:\n" .
                             "- WAJIB gunakan Bahasa Indonesia dalam SETIAP respons, tanpa pengecualian.\n" .
                             "- Jangan pernah menjawab dalam bahasa Inggris atau bahasa lain.\n\n" .
                             "GAYA KOMUNIKASI:\n" .
                             "- Gunakan bahasa Indonesia yang santai tapi sopan (sapaan: 'Halo Kak!', penutup: 'Semoga sehat selalu! 😊').\n" .
                             "- Gunakan emoji secukupnya untuk suasana hangat (😊, 👁️, ✨, 💙).\n" .
                             "- Berikan motivasi atau kata penyemangat di akhir setiap respons.\n" .
                             "- Jika user bertanya di luar topik kesehatan mata, arahkan kembali dengan sopan.\n\n" .
                             "FORMAT RESPONS:\n" .
                             "- Gunakan Markdown (bold, bullet points) agar tampilan di aplikasi rapi.\n" .
                             "- Pisahkan poin-poin penting dengan baris baru.\n" .
                             "- Berikan tips praktis yang bisa langsung dilakukan (contoh: aturan 20-20-20).",
            ],
        ];
        
        foreach ($history as $msg) {
            $role = $msg['role'] === 'model' ? 'assistant' : $msg['role'];
            $messages[] = [
                'role' => $role,
                'content' => $msg['content'],
            ];
        }
        
        $messages[] = [
            'role' => 'user',
            'content' => $message,
        ];
        
        $payload = [
            'model' => $this->model,
            'messages' => $messages,
            'temperature' => 0.7,
        ];
        
        $attempt = 0;
        do {
            try {
                $response = \Illuminate\Support\Facades\Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ])->timeout(30)->post("{$this->baseUrl}/chat/completions", $payload);

                if ($response->successful()) {
                    $decoded = $response->json();
                    return $decoded['choices'][0]['message']['content'] ?? 'Tidak ada respons dari AI.';
                }

                if ($response->status() === 429) {
                    $retryAfter = (int) $response->header('Retry-After', $this->retryDelay / 1000);
                    sleep($retryAfter);
                    continue;
                }

                $msg = $response->json('error.message') ?? 'OpenRouter API error';
                throw new \App\Exceptions\GeminiException($msg, $response->status());
            } catch (\Exception $e) {
                if ($attempt >= $this->maxRetries) {
                    throw new \App\Exceptions\GeminiException('Gagal terhubung ke OpenRouter: ' . $e->getMessage());
                }
                usleep($this->retryDelay * 1000);
            }
            $attempt++;
        } while ($attempt <= $this->maxRetries);

        throw new \App\Exceptions\GeminiException('OpenRouter service tidak tersedia saat ini.');
    }

    /**
     * Build a prompt for refraction analysis (copied from GeminiService).
     */
    private function buildRefractionPrompt(array $data): string
    {
        $formatted = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        return <<<PROMPT
Anda adalah 'MataCeria AI', ahli optometri digital yang ramah dan sangat komunikatif.

TUGAS ANDA:
1. Menganalisis data refraksi mata (Ukuran Kacamata/Softlens) berikut.
2. Memberikan penjelasan yang sangat mudah dipahami tentang kondisi mata (Myopia/Rabun Jauh jika minus, Hyperopia/Rabun Dekat jika plus).
3. Memberikan deskripsi hasil yang aplikatif dan menenangkan.

DATA REFRAKSI:
{$formatted}

FORMAT RESPONS (JSON valid):
{
  "kondisi": "Deskripsi singkat dan ramah",
  "kategori": "Normal | Rabun Jauh | Rabun Dekat | Silinder | Komplikasi",
  "tingkat_keparahan": "Normal | Ringan | Sedang | Berat",
  "rekomendasi": ["Saran praktis 1", "Saran praktis 2"],
  "saran_kacamata": "Penjelasan mengenai lensa yang dibutuhkan",
  "perlu_ke_dokter": true,
  "tips_kesehatan": "Tips menjaga kesehatan mata",
  "pesan_motivasi": "Kata-kata penyemangat",
  "friendly_summary": "Ringkasan sangat singkat (1-2 kalimat)"
}
PROMPT;
    }

    /**
     * Build a prompt for Snellen analysis (copied from GeminiService).
     */
    private function buildSnellenPrompt(array $data): string
    {
        $formatted = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $smallestRow  = $data['smallest_row_read'] ?? 200;
        $smallestN    = $data['smallest_n_point'] ?? 12;
        $astigmatism  = ($data['astigmatism_found'] ?? false) ? 'Ya (terdeteksi)' : 'Tidak';
        $duochrome    = $data['duochrome_result'] ?? 'tidak ada data';
        $testType     = $data['test_type'] ?? 'distance';
        $avgDistance  = $data['avg_distance_cm'] ?? 40;
        return <<<PROMPT
Anda adalah 'MataCeria AI', asisten skrining kesehatan mata yang sangat ahli.

TUGAS ANDA:
1. Menganalisis hasil tes refraksi digital berikut secara mendalam.
2. Memberikan diagnosa awal yang TEPAT dan ramah (bukan diagnosa medis final).
3. Menentukan kondisi utama: Miopi (Rabun Jauh), Hipermetropi/Presbiopi (Rabun Dekat), Astigmatisme (Silinder), atau Normal.
4. Memberikan penjelasan sangat mudah dipahami orang awam dengan gaya bahasa seperti sahabat yang peduli.

DATA HASIL TES LENGKAP:
{$formatted}

PANDUAN INTERPRETASI KHUSUS UNTUK TES INI:
- Jarak rata-rata pengujian: {$avgDistance} cm
- Tipe tes: {$testType}
- Skor Snellen terkecil yang terbaca: 20/{$smallestRow}
- Poin ketajaman dekat terkecil yang terbaca: N{$smallestN}
- Indikasi Silinder/Astigmatisme: {$astigmatism}
- Hasil tes duochrome: {$duochrome}

ATURAN DIAGNOSA:
- Jika test_type == 'distance' DAN smallest_row_read >= 40 DAN astigmatism_found = false: kemungkinan besar Rabun Jauh (Miopi). JANGAN diagnosa Rabun Dekat jika test_type adalah 'distance'.
- Jika test_type == 'near' DAN smallest_n_point >= 8 DAN astigmatism_found = false: kemungkinan besar Rabun Dekat (Hipermetropi/Presbiopi). JANGAN diagnosa Rabun Jauh jika test_type adalah 'near'.
- Jika test_type == 'comprehensive': pertimbangkan SEMUA data. Jika smallest_row_read >= 40 maka Rabun Jauh. Jika smallest_n_point >= 8 maka Rabun Dekat.
- Jika astigmatism_found = true: Silinder (Astigmatisme) - bisa kombinasi dengan Rabun Jauh/Dekat.

FORMAT RESPONS (JSON valid TANPA markdown, TANPA teks lain):
{
  "predicted_class": "Normal | Rabun Jauh | Rabun Dekat | Silinder | Rabun Jauh & Silinder | Rabun Dekat & Silinder",
  "confidence": 0.90,
  "visual_acuity": "20/{$smallestRow}",
  "snellen_decimal": 0.67,
  "recommendation": "Berikan penjelasan yang mendalam, spesifik, dan aplikatif namun tetap PADAT dan tidak bertele-tele (untuk menghemat kuota). Gunakan gaya bicara ramah. Wajib sertakan: 1. Detail kondisi hasil tes. 2. Saran tindakan konkret (misal: 'Periksa ke dokter' atau 'Perlu kacamata'). 3. Tips praktis (misal: aturan 20-20-20). JANGAN bertele-tele.",
  "action_required": true,
  "can_consult_chatbot": true,
  "friendly_summary": "Ringkasan hasil tes dalam 1-2 kalimat ramah."
}
PROMPT;
    }

    /**
     * Make request to OpenRouter API with retry logic.
     */
    private function makeRequest(string $prompt, int $timeout = 30): string
    {
        $this->validateConfiguration();
        $payload = [
            'model' => $this->model,
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant that returns only the JSON response without any extra text.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.2,
            'max_tokens' => 512,
        ];
        $attempt = 0;
        do {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ])->timeout($timeout)->post("{$this->baseUrl}/chat/completions", $payload);

                if ($response->successful()) {
                    return $response->body();
                }

                if ($response->status() === 429) {
                    $retryAfter = (int) $response->header('Retry-After', $this->retryDelay / 1000);
                    Log::warning('OpenRouter rate limit hit, retrying', ['retry_after' => $retryAfter, 'attempt' => $attempt]);
                    sleep($retryAfter);
                    continue;
                }

                // Other HTTP errors
                $msg = $response->json('error.message') ?? 'OpenRouter API error';
                Log::error('OpenRouter API error', ['status' => $response->status(), 'message' => $msg]);
                throw new GeminiException($msg, $response->status());
            } catch (\Exception $e) {
                Log::error('OpenRouter request exception', ['message' => $e->getMessage(), 'attempt' => $attempt]);
                if ($attempt >= $this->maxRetries) {
                    throw new GeminiException('Gagal terhubung ke OpenRouter: ' . $e->getMessage());
                }
                usleep($this->retryDelay * 1000);
            }
            $attempt++;
        } while ($attempt <= $this->maxRetries);

        throw new GeminiException('OpenRouter service tidak tersedia saat ini.');
    }

    /**
     * Parse JSON response similar to GeminiService.
     */
    private function parseJsonResponse(string $raw): array
    {
        $decoded = json_decode(trim($raw), true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return [
                'predicted_class' => 'Normal',
                'confidence' => 0.5,
                'recommendation' => 'Gagal mem-parse respons dari OpenRouter.',
            ];
        }
        
        $content = $decoded['choices'][0]['message']['content'] ?? '';
        
        // Remove markdown code blocks if present
        $content = preg_replace('/```json\s*|```/', '', $content);
        
        $result = json_decode(trim($content), true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($result)) {
            return $result;
        }
        
        // Fallback if content is not JSON
        return [
            'predicted_class' => 'Normal',
            'confidence' => 0.5,
            'recommendation' => $content ?: 'Tidak dapat mem-parse respons kontent.',
        ];
    }
}
?>
