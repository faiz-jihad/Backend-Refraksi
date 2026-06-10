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

    private const FALLBACK_MODELS = [
        'nvidia/nemotron-nano-12b-v2-vl:free',
        'qwen/qwen3-next-80b-a3b-instruct:free',
        'nvidia/nemotron-nano-9b-v2:free',
        'openai/gpt-oss-120b:free',
        'openai/gpt-oss-20b:free',
        'qwen/qwen3-coder:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'meta-llama/llama-3.2-3b-instruct:free',
        'openrouter/free',
    ];

    /**
     * Get list of models to try in order of preference.
     */
    private function getModelsToTry(): array
    {
        $models = [$this->model];
        foreach (self::FALLBACK_MODELS as $m) {
            if ($m !== $this->model) {
                $models[] = $m;
            }
        }
        return $models;
    }

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

        $models = $this->getModelsToTry();
        $lastException = null;

        foreach ($models as $currentModel) {
            Log::info("Attempting OpenRouter chat using model: {$currentModel}");
            $payload = [
                'model' => $currentModel,
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
                        Log::warning("OpenRouter chat rate limit hit for {$currentModel}, retrying", ['retry_after' => $retryAfter, 'attempt' => $attempt]);
                        sleep($retryAfter);
                        continue;
                    }

                    $msg = $response->json('error.message') ?? 'OpenRouter API error';
                    Log::error("OpenRouter API error in chat for model {$currentModel}", ['status' => $response->status(), 'message' => $msg]);
                    $lastException = new \App\Exceptions\GeminiException($msg, $response->status());
                    break; // Try next model
                } catch (\Exception $e) {
                    Log::error("OpenRouter chat exception for model {$currentModel}", ['message' => $e->getMessage(), 'attempt' => $attempt]);
                    $lastException = new \App\Exceptions\GeminiException("Gagal terhubung ke OpenRouter ({$currentModel}): " . $e->getMessage());
                    if ($attempt >= $this->maxRetries) {
                        break; // Try next model
                    }
                    usleep($this->retryDelay * 1000);
                }
                $attempt++;
            } while ($attempt <= $this->maxRetries);
        }

        throw $lastException ?? new \App\Exceptions\GeminiException('OpenRouter service tidak tersedia saat ini.');
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
  "recommendation": "Berikan penjelasan yang mendalam, spesifik, dan aplikatif namun tetap PADAT dan tidak bertele-tele (untuk menghemat kuota). Gunakan gaya bicara ramah. Wajib sertakan: 1. Detail kondisi hasil tes. 2. Estimasi kasar ukuran kacamata yang dibutuhkan jika tidak normal (misal: perkiraan Spheris -1.00 D jika hasil 20/100, atau ukuran plus/silinder jika terindikasi) beserta catatan bahwa ini hanya perkiraan awal skrining dan bukan resep medis final. 3. Saran tindakan konkret (misal: 'Periksa ke dokter' atau 'Perlu kacamata'). 4. Tips praktis (misal: aturan 20-20-20). JANGAN bertele-tele.",
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
        $models = $this->getModelsToTry();
        $lastException = null;

        foreach ($models as $currentModel) {
            Log::info("Attempting OpenRouter request using model: {$currentModel}");
            $payload = [
                'model' => $currentModel,
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful assistant that returns only the JSON response without any extra text.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.2,
                'max_tokens' => 512,
            ];
            
            $attempt = 0;
            $modelSuccessful = false;
            $responseBody = '';
            
            do {
                try {
                    $response = Http::withHeaders([
                        'Authorization' => 'Bearer ' . $this->apiKey,
                        'Content-Type' => 'application/json',
                    ])->timeout($timeout)->post("{$this->baseUrl}/chat/completions", $payload);

                    if ($response->successful()) {
                        $responseBody = $response->body();
                        $modelSuccessful = true;
                        break;
                    }

                    if ($response->status() === 429) {
                        $retryAfter = (int) $response->header('Retry-After', $this->retryDelay / 1000);
                        Log::warning("OpenRouter rate limit hit for {$currentModel}, retrying", ['retry_after' => $retryAfter, 'attempt' => $attempt]);
                        sleep($retryAfter);
                        continue;
                    }

                    // Other HTTP errors (e.g. 400, 500, 503)
                    $msg = $response->json('error.message') ?? 'OpenRouter API error';
                    Log::error("OpenRouter API error for model {$currentModel}", ['status' => $response->status(), 'message' => $msg]);
                    $lastException = new GeminiException($msg, $response->status());
                    // Break the attempt loop to try the next model
                    break;
                } catch (\Exception $e) {
                    Log::error("OpenRouter request exception for model {$currentModel}", ['message' => $e->getMessage(), 'attempt' => $attempt]);
                    $lastException = new GeminiException("Gagal terhubung ke OpenRouter ({$currentModel}): " . $e->getMessage());
                    if ($attempt >= $this->maxRetries) {
                        break; // Try the next model
                    }
                    usleep($this->retryDelay * 1000);
                }
                $attempt++;
            } while ($attempt <= $this->maxRetries);
            
            if ($modelSuccessful) {
                return $responseBody;
            }
        }

        throw $lastException ?? new GeminiException('OpenRouter service tidak tersedia saat ini.');
    }

    /**
     * Parse JSON response similar to GeminiService.
     * Tidak pernah throw exception — selalu kembalikan array valid.
     */
    private function parseJsonResponse(string $raw): array
    {
        Log::info('OpenRouter Raw Response Received', [
            'length'  => strlen($raw),
            'preview' => mb_substr($raw, 0, 250),
        ]);

        // Log the full response on debug level only to save production disk space/io
        Log::debug('OpenRouter Full Raw Response Payload:', ['payload' => $raw]);

        if (empty(trim($raw))) {
            Log::warning('OpenRouter returned completely empty response');
            return $this->buildFallbackResponse('Normal', 'AI tidak memberikan analisis. Silakan coba lagi.');
        }

        $decoded = json_decode(trim($raw), true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            Log::warning('OpenRouter JSON Parse failed for main payload: ' . json_last_error_msg(), [
                'raw_payload' => $raw
            ]);
            return $this->buildFallbackResponse('Normal', 'Gagal mem-parse respons utama dari OpenRouter.');
        }
        
        $content = $decoded['choices'][0]['message']['content'] ?? '';
        if (empty(trim($content))) {
            Log::warning('OpenRouter message content is empty', ['decoded_payload' => $decoded]);
            return $this->buildFallbackResponse('Normal', 'Konten respons OpenRouter kosong.');
        }

        // Strategy 1: Content is already pure JSON
        $result = json_decode(trim($content), true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($result)) {
            return $result;
        }

        // Strategy 2: Extract JSON from various formats (markdown, mixed text)
        $extracted = $this->extractJsonFromResponse($content);
        $result = json_decode($extracted, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($result)) {
            return $result;
        }

        // Strategy 3: Sanitize and try again
        $sanitized = $this->sanitizeJsonString($extracted);
        $result = json_decode($sanitized, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($result)) {
            return $result;
        }

        // Strategy 4: Build structured response from raw text (graceful degradation)
        Log::warning('OpenRouter JSON Parse failed after all strategies — using text-based fallback', [
            'json_error' => json_last_error_msg(),
            'raw_content'=> mb_substr($content, 0, 800),
        ]);

        return $this->buildTextFallbackResponse($content);
    }

    /**
     * Extract JSON from various response formats (markdown, mixed text, etc).
     */
    private function extractJsonFromResponse(string $raw): string
    {
        $raw = trim($raw);

        // Remove BOM and invisible control characters
        $raw = preg_replace('/^[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\xEF\xBB\xBF]+/', '', $raw);

        // Pattern 1: ```json ... ``` with possible newlines
        if (preg_match('/```json\s*([\s\S]*?)\s*```/i', $raw, $m) && !empty(trim($m[1]))) {
            return trim($m[1]);
        }

        // Pattern 2: ``` ... ``` (plain code block)
        if (preg_match('/```\s*([\s\S]*?)\s*```/', $raw, $m) && !empty(trim($m[1]))) {
            $inner = trim($m[1]);
            if (str_starts_with($inner, '{') || str_starts_with($inner, '[')) {
                return $inner;
            }
        }

        // Pattern 3: Find the outermost balanced { ... } block
        $startPos = strpos($raw, '{');
        if ($startPos !== false) {
            $depth   = 0;
            $inStr   = false;
            $escape  = false;
            $len     = strlen($raw);
            $endPos  = -1;

            for ($i = $startPos; $i < $len; $i++) {
                $ch = $raw[$i];

                if ($escape) { $escape = false; continue; }
                if ($ch === '\\' && $inStr) { $escape = true; continue; }
                if ($ch === '"') { $inStr = !$inStr; continue; }
                if ($inStr) continue;

                if ($ch === '{') $depth++;
                elseif ($ch === '}') {
                    $depth--;
                    if ($depth === 0) { $endPos = $i; break; }
                }
            }

            if ($endPos > $startPos) {
                return substr($raw, $startPos, $endPos - $startPos + 1);
            }
        }

        // Pattern 4: Fallback — return as-is
        return $raw;
    }

    /**
     * Sanitize common JSON issues from OpenRouter output.
     */
    private function sanitizeJsonString(string $json): string
    {
        // Remove trailing commas before } or ]
        $json = preg_replace('/,\s*([}\]])/m', '$1', $json);

        // Remove single-line comments (// ...)
        $json = preg_replace('/\/\/[^\n]*/', '', $json);

        // Replace curly/smart quotes with straight quotes
        $json = str_replace(["\u{201C}", "\u{201D}", "\u{2018}", "\u{2019}"], '"', $json);

        // Trim whitespace
        return trim($json);
    }

    /**
     * Build a fallback response when JSON parsing completely fails.
     * Tries to extract key information from raw text.
     */
    private function buildTextFallbackResponse(string $rawText): array
    {
        $lower = strtolower($rawText);

        // Detect condition from text keywords
        $predictedClass = 'Normal';
        if (str_contains($lower, 'rabun jauh') || str_contains($lower, 'miopi') || str_contains($lower, 'myopia')) {
            $predictedClass = 'Rabun Jauh';
        } elseif (str_contains($lower, 'rabun dekat') || str_contains($lower, 'hiper') || str_contains($lower, 'presbi')) {
            $predictedClass = 'Rabun Dekat';
        } elseif (str_contains($lower, 'silinder') || str_contains($lower, 'astigmat')) {
            $predictedClass = 'Silinder';
        }

        // Extract a clean summary (first 300 chars, no JSON artifacts)
        $cleanText = preg_replace('/[{}\[\]":]/', '', $rawText);
        $cleanText = preg_replace('/\s+/', ' ', trim($cleanText));
        $recommendation = mb_substr($cleanText, 0, 300);
        if (empty($recommendation)) {
            $recommendation = 'Berdasarkan analisis, disarankan untuk melakukan pemeriksaan ke dokter mata.';
        }

        return $this->buildFallbackResponse($predictedClass, $recommendation);
    }

    /**
     * Build a standard structured fallback response.
     */
    private function buildFallbackResponse(string $predictedClass, string $recommendation): array
    {
        return [
            'predicted_class'   => $predictedClass,
            'confidence'        => 0.50,
            'visual_acuity'     => null,
            'snellen_decimal'   => null,
            'recommendation'    => $recommendation,
            'action_required'   => $predictedClass !== 'Normal',
            'can_consult_chatbot' => true,
            'friendly_summary'  => 'Hasil analisis menunjukkan kondisi ' . $predictedClass . '. Silakan konsultasikan dengan dokter mata untuk pemeriksaan lebih lanjut.',
        ];
    }
}
?>
