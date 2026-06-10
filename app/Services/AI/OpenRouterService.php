<?php

declare(strict_types=1);

namespace App\Services\AI;

use App\Exceptions\GeminiException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use InvalidArgumentException;

class OpenRouterService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;
    private int $maxRetries;
    private int $retryDelay;
    private int $timeout;
    private bool $fallbackEnabled;
    
    // HTTP Referer untuk OpenRouter ranking (opsional tapi direkomendasikan)
    private string $httpReferer;
    private string $appTitle;

    /**
     * Model fallback yang akan dicoba secara berurutan.
     * Diurutkan dari yang paling capable ke yang paling ringan.
     */
    private const FALLBACK_MODELS = [
        'google/gemini-2.0-flash-lite-preview-02-05:free',  // Gemini Flash (paling capable)
        'meta-llama/llama-3.3-70b-instruct:free',            // Llama 70B
        'qwen/qwen3-next-80b-a3b-instruct:free',             // Qwen 80B MoE
        'meta-llama/llama-3.2-3b-instruct:free',             // Llama 3B (ringan)
    ];

    public function __construct()
    {
        $this->apiKey     = config('services.openrouter.api_key', '');
        $this->model      = config('services.openrouter.model', 'google/gemini-2.0-flash-lite-preview-02-05:free');
        $this->baseUrl    = rtrim(config('services.openrouter.base_url', 'https://openrouter.ai/api/v1'), '/');
        $this->maxRetries = (int) config('services.openrouter.max_retries', 2);
        $this->retryDelay = (int) config('services.openrouter.retry_delay', 1000);
        $this->timeout    = (int) config('services.openrouter.timeout', 30);
        $this->fallbackEnabled = config('services.openrouter.fallback_enabled', true);
        
        // OpenRouter ranking headers (helps with rate limits on free models)
        $this->httpReferer = config('app.url', 'https://mataceria.app');
        $this->appTitle    = config('app.name', 'MataCeria AI');
    }

    /**
     * Validate service configuration.
     */
    private function validateConfiguration(): void
    {
        if (empty($this->apiKey)) {
            throw new GeminiException(
                'OpenRouter API key tidak dikonfigurasi. Silakan set OPENROUTER_API_KEY di .env'
            );
        }
        
        if (empty($this->model)) {
            throw new GeminiException('Model OpenRouter tidak dikonfigurasi');
        }
    }

    /**
     * Get list of models to try in order of preference.
     * Primary model first, then fallbacks (excluding duplicates).
     */
    private function getModelsToTry(): array
    {
        if (!$this->fallbackEnabled) {
            return [$this->model];
        }
        
        $models = [$this->model];
        foreach (self::FALLBACK_MODELS as $fallback) {
            if ($fallback !== $this->model && !in_array($fallback, $models, true)) {
                $models[] = $fallback;
            }
        }
        return $models;
    }

    /**
     * Analyze refraction data using OpenRouter.
     *
     * @param array $refractionData
     * @return array
     * @throws GeminiException
     */
    public function analyzeRefraction(array $refractionData): array
    {
        $this->validateRefractionData($refractionData);
        
        $prompt = $this->buildRefractionPrompt($refractionData);
        $raw = $this->generateStructuredContent($prompt);
        
        return $this->parseJsonResponse($raw);
    }

    /**
     * Analyze Snellen test data using OpenRouter.
     *
     * @param array $snellenData
     * @param string|null $imageBase64 (not used for OpenRouter text-only)
     * @return array
     * @throws GeminiException
     */
    public function analyzeSnellen(array $snellenData, ?string $imageBase64 = null): array
    {
        $this->validateSnellenData($snellenData);
        
        // OpenRouter free models mostly don't support vision
        // For production, consider upgrading to a paid vision model
        if ($imageBase64) {
            Log::warning('OpenRouter: Image analysis requested but using text-only mode');
        }
        
        $prompt = $this->buildSnellenPrompt($snellenData);
        $raw = $this->generateStructuredContent($prompt);
        
        return $this->parseJsonResponse($raw);
    }

    /**
     * Chat using OpenRouter with conversation history.
     *
     * @param string $message
     * @param array $history
     * @param array $options Additional options (temperature, max_tokens, etc.)
     * @return string
     * @throws GeminiException
     */
    public function chat(string $message, array $history = [], array $options = []): string
    {
        if (trim($message) === '') {
            throw new InvalidArgumentException('Pesan tidak boleh kosong');
        }

        $this->validateConfiguration();
        
        $messages = $this->buildChatMessages($message, $history);
        
        $temperature = $options['temperature'] ?? 0.7;
        $maxTokens = $options['max_tokens'] ?? 1024;
        
        $models = $this->getModelsToTry();
        $lastException = null;

        foreach ($models as $currentModel) {
            try {
                $payload = [
                    'model'       => $currentModel,
                    'messages'    => $messages,
                    'temperature' => $temperature,
                    'max_tokens'  => $maxTokens,
                ];

                Log::info("OpenRouter chat attempt", ['model' => $currentModel]);
                
                $response = $this->sendChatRequest($payload);
                
                $content = $response['choices'][0]['message']['content'] ?? null;
                
                if (empty($content)) {
                    Log::warning("OpenRouter: Empty content from {$currentModel}, trying next model");
                    continue;
                }
                
                Log::info("OpenRouter chat success", [
                    'model' => $currentModel,
                    'tokens_used' => $response['usage']['total_tokens'] ?? 'unknown'
                ]);
                
                return $content;
                
            } catch (GeminiException $e) {
                Log::warning("OpenRouter chat failed for {$currentModel}: " . $e->getMessage());
                $lastException = $e;
                continue;
            } catch (\Exception $e) {
                Log::error("OpenRouter chat unexpected error for {$currentModel}: " . $e->getMessage());
                $lastException = new GeminiException(
                    "Gagal terhubung ke OpenRouter ({$currentModel}): " . $e->getMessage()
                );
                continue;
            }
        }

        throw $lastException ?? new GeminiException(
            'Semua model OpenRouter tidak tersedia. Silakan coba lagi nanti.'
        );
    }

    /**
     * Generate structured JSON content (for analysis endpoints).
     * This method is optimized for JSON responses.
     *
     * @param string $userPrompt The analysis prompt
     * @return array Raw response array from API
     * @throws GeminiException
     */
    private function generateStructuredContent(string $userPrompt): array
    {
        $this->validateConfiguration();
        
        $systemPrompt = "Anda adalah AI analis data kesehatan mata yang presisi. " .
                        "TUGAS: Berikan respons HANYA dalam format JSON valid tanpa teks tambahan. " .
                        "TIDAK BOLEH ada markdown, code blocks, atau teks di luar JSON. " .
                        "Jika ragu dengan nilai, gunakan null. Pastikan JSON bisa di-parse langsung.";
        
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $userPrompt],
        ];
        
        $payload = [
            'model'       => $this->model,
            'messages'    => $messages,
            'temperature' => 0.2,      // Low temperature for consistent JSON
            'max_tokens'  => 512,
            'response_format' => ['type' => 'json_object'], // OpenRouter supports this for some models
        ];

        return $this->sendChatRequest($payload);
    }

    /**
     * Send a chat completion request with retry and fallback logic.
     *
     * @param array $payload Request payload
     * @param string|null $modelOverride Specific model to use (overrides payload model)
     * @return array Decoded response JSON
     * @throws GeminiException
     */
    private function sendChatRequest(array $payload, ?string $modelOverride = null): array
    {
        if ($modelOverride) {
            $payload['model'] = $modelOverride;
        }
        
        $attempt = 0;
        $lastException = null;
        
        while ($attempt <= $this->maxRetries) {
            try {
                $response = Http::withHeaders($this->getRequestHeaders())
                    ->timeout($this->timeout)
                    ->post("{$this->baseUrl}/chat/completions", $payload);

                // Success
                if ($response->successful()) {
                    $data = $response->json();
                    
                    // Validate response structure
                    if (!isset($data['choices'][0]['message']['content'])) {
                        throw new GeminiException('Respons OpenRouter tidak valid: missing content');
                    }
                    
                    return $data;
                }

                // Rate limiting (429)
                if ($response->status() === 429) {
                    $retryAfter = (int) $response->header('Retry-After', $this->retryDelay / 1000);
                    Log::warning('OpenRouter rate limit', [
                        'retry_after' => $retryAfter,
                        'attempt'     => $attempt + 1,
                        'model'       => $payload['model'] ?? 'unknown',
                    ]);
                    
                    if ($retryAfter > 60) {
                        // Too long to wait, skip to next model
                        throw new GeminiException('Rate limit terlalu lama (>60s)');
                    }
                    
                    sleep(max(1, $retryAfter));
                    $attempt++;
                    continue;
                }

                // Provider errors (5xx) - OpenRouter specific
                if ($response->status() >= 500) {
                    $errorMessage = $response->json('error.metadata.raw') ?? 
                                    $response->json('error.message') ?? 
                                    'Unknown server error';
                    
                    Log::error('OpenRouter provider error', [
                        'status'  => $response->status(),
                        'model'   => $payload['model'] ?? 'unknown',
                        'error'   => $errorMessage,
                    ]);
                    
                    throw new GeminiException(
                        "Provider error untuk model {$payload['model']}: {$errorMessage}",
                        $response->status()
                    );
                }

                // Client errors (4xx except 429)
                $errorData = $response->json();
                $errorMessage = $errorData['error']['message'] ?? 
                                $errorData['error']['metadata']['raw'] ?? 
                                'Unknown client error';
                
                Log::error('OpenRouter client error', [
                    'status'  => $response->status(),
                    'model'   => $payload['model'] ?? 'unknown',
                    'error'   => $errorMessage,
                ]);
                
                throw new GeminiException($errorMessage, $response->status());

            } catch (ConnectionException $e) {
                Log::error('OpenRouter connection error', [
                    'message' => $e->getMessage(),
                    'attempt' => $attempt + 1,
                ]);
                
                if ($attempt >= $this->maxRetries) {
                    throw new GeminiException(
                        'Tidak dapat terhubung ke OpenRouter: ' . $e->getMessage()
                    );
                }
                
                $this->exponentialBackoff($attempt);
                $attempt++;
                continue;
            }
        }
        
        throw $lastException ?? new GeminiException('OpenRouter tidak merespons setelah beberapa percobaan');
    }

    /**
     * Get OpenRouter specific HTTP headers.
     */
    private function getRequestHeaders(): array
    {
        return [
            'Authorization'     => 'Bearer ' . $this->apiKey,
            'Content-Type'      => 'application/json',
            'HTTP-Referer'      => $this->httpReferer,   // OpenRouter ranking
            'X-Title'           => $this->appTitle,       // App identification
            'X-Request-ID'      => uniqid('mata-', true), // Idempotency
        ];
    }

    /**
     * Build messages array for chat completions.
     */
    private function buildChatMessages(string $message, array $history): array
    {
        $messages = [
            [
                'role'    => 'system',
                'content' => $this->getSystemPrompt(),
            ],
        ];
        
        // Add conversation history
        foreach ($history as $msg) {
            if (!isset($msg['role'], $msg['content'])) {
                continue;
            }
            
            // Convert 'model' role to 'assistant' (OpenRouter standard)
            $role = match ($msg['role']) {
                'model'     => 'assistant',
                'assistant' => 'assistant',
                'user'      => 'user',
                'system'    => 'system',
                default     => null,
            };
            
            if ($role === null) {
                continue; // Skip invalid roles
            }
            
            $messages[] = [
                'role'    => $role,
                'content' => $msg['content'],
            ];
        }
        
        // Add current user message
        $messages[] = [
            'role'    => 'user',
            'content' => $message,
        ];

        return $messages;
    }

    /**
     * Get system prompt for chat mode.
     */
    private function getSystemPrompt(): string
    {
        return <<<PROMPT
Anda adalah 'MataCeria AI', asisten kesehatan mata yang ramah, profesional, dan empatik. 
Anda membantu pengguna memahami kondisi kesehatan mata dan memberikan informasi edukatif.

ATURAN BAHASA:
- WAJIB gunakan Bahasa Indonesia dalam SETIAP respons, tanpa pengecualian.
- Jangan pernah menjawab dalam bahasa Inggris atau bahasa lain.
- Gunakan bahasa yang mudah dipahami orang awam.

GAYA KOMUNIKASI:
- Gunakan bahasa Indonesia yang santai tapi sopan.
- Sapaan pembuka yang hangat seperti 'Halo Kak!'
- Gunakan emoji secukupnya (😊, 👁️, ✨, 💙).
- Berikan motivasi atau kata penyemangat di akhir respons.
- Jika user bertanya di luar topik kesehatan mata, arahkan kembali dengan sopan.

FORMAT RESPONS:
- Gunakan Markdown (bold, bullet points) agar tampilan rapi.
- Pisahkan poin-poin penting dengan baris baru.
- Berikan tips praktis (contoh: aturan 20-20-20).
- JANGAN memberikan diagnosa medis final, selalu sarankan konsultasi ke dokter.

BATASAN:
- Jangan memberikan resep obat atau ukuran kacamata yang spesifik.
- Selalu ingatkan bahwa analisis ini adalah skrining awal.
- Jika kondisi tampak serius, kuatkan saran untuk segera ke dokter mata.
PROMPT;
    }

    /**
     * Build refraction analysis prompt.
     */
    private function buildRefractionPrompt(array $data): string
    {
        $formatted = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        return <<<PROMPT
Analisis data refraksi mata berikut dan berikan hasil dalam format JSON:

DATA REFRAKSI:
{$formatted}

PANDUAN:
- Sphere (S) minus (-): Rabun Jauh (Miopi)
- Sphere (S) plus (+): Rabun Dekat (Hipermetropi/Presbiopi)
- Cylinder (C): Astigmatisme (Silinder)

OUTPUT (JSON ONLY):
{
  "kondisi": "Deskripsi singkat kondisi mata",
  "kategori": "Normal|Rabun Jauh|Rabun Dekat|Silinder|Komplikasi",
  "tingkat_keparahan": "Normal|Ringan|Sedang|Berat",
  "rekomendasi": ["Saran 1", "Saran 2"],
  "saran_kacamata": "Penjelasan lensa yang dibutuhkan",
  "perlu_ke_dokter": true,
  "tips_kesehatan": "Tips menjaga kesehatan mata",
  "pesan_motivasi": "Kata penyemangat",
  "friendly_summary": "Ringkasan 1-2 kalimat untuk TTS"
}
PROMPT;
    }

    /**
     * Build Snellen test analysis prompt.
     */
    private function buildSnellenPrompt(array $data): string
    {
        $formatted = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        $smallestRow  = $data['smallest_row_read'] ?? 200;
        $smallestN    = $data['smallest_n_point'] ?? 12;
        $astigmatism  = ($data['astigmatism_found'] ?? false) ? 'Ya' : 'Tidak';
        $duochrome    = $data['duochrome_result'] ?? 'tidak ada data';
        $testType     = $data['test_type'] ?? 'distance';
        $avgDistance  = $data['avg_distance_cm'] ?? 40;

        return <<<PROMPT
Analisis hasil tes refraksi digital berikut:

DATA TES:
{$formatted}

KONTEKS:
- Jarak tes: {$avgDistance} cm
- Tipe tes: {$testType}
- Baris terkecil terbaca: 20/{$smallestRow}
- Poin dekat terkecil: N{$smallestN}
- Indikasi Silinder: {$astigmatism}
- Hasil Duochrome: {$duochrome}

ACUAN ESTIMASI:
- 20/20: Normal (0.00 D)
- 20/25: -0.25 s.d -0.50
- 20/30: -0.50 s.d -1.00
- 20/40: -1.00 s.d -1.50
- 20/60: -1.50 s.d -2.00
- 20/80: -2.00 s.d -2.50
- 20/200+: Di atas -4.00

ATURAN DIAGNOSA:
- test_type 'distance' + smallest_row_read >= 40 = Rabun Jauh
- test_type 'near' + smallest_n_point >= 8 = Rabun Dekat
- test_type 'comprehensive' = pertimbangkan semua data
- astigmatism_found = true = Silinder (bisa kombinasi)

OUTPUT (JSON ONLY):
{
  "predicted_class": "Normal|Rabun Jauh|Rabun Dekat|Silinder|Rabun Jauh & Silinder|Rabun Dekat & Silinder",
  "confidence": 0.85,
  "visual_acuity": "20/{$smallestRow}",
  "snellen_decimal": 0.67,
  "recommendation": "Penjelasan padat: kondisi, estimasi ukuran lensa, saran konkret, tips",
  "action_required": true,
  "can_consult_chatbot": true,
  "friendly_summary": "Ringkasan 1-2 kalimat untuk TTS"
}
PROMPT;
    }

    /**
     * Validate refraction data.
     */
    private function validateRefractionData(array $data): void
    {
        $requiredFields = ['right_eye_sphere', 'left_eye_sphere', 'visual_acuity'];
        
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                throw new InvalidArgumentException(
                    "Data refraksi tidak lengkap: {$field} harus diisi"
                );
            }
        }
    }

    /**
     * Validate Snellen data.
     */
    private function validateSnellenData(array $data): void
    {
        $requiredFields = ['smallest_row_read', 'test_type'];
        
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                throw new InvalidArgumentException(
                    "Data Snellen tidak lengkap: {$field} harus diisi"
                );
            }
        }

        $validTestTypes = ['distance', 'near', 'comprehensive'];
        if (!in_array($data['test_type'], $validTestTypes)) {
            throw new InvalidArgumentException(
                'Tipe tes tidak valid. Harus: ' . implode(', ', $validTestTypes)
            );
        }
    }

    /**
     * Apply exponential backoff delay.
     */
    private function exponentialBackoff(int $attempt): void
    {
        $delay = $this->retryDelay * (2 ** $attempt); // 1s, 2s, 4s...
        $jitter = rand(0, 500); // Add jitter ±500ms
        
        usleep(($delay + $jitter) * 1000);
    }

    // ============================================================================
    // JSON PARSING (sama seperti sebelumnya, tapi diadaptasi untuk OpenRouter)
    // ============================================================================

    /**
     * Parse JSON response from OpenRouter.
     * Never throws exception — always returns valid array.
     */
    private function parseJsonResponse(array $apiResponse): array
    {
        $content = $apiResponse['choices'][0]['message']['content'] ?? '';
        
        Log::debug('OpenRouter content received', [
            'length'  => strlen($content),
            'preview' => mb_substr($content, 0, 300),
        ]);

        if (empty(trim($content))) {
            Log::error('OpenRouter returned empty content');
            return $this->buildFallbackResponse('Normal', 'AI tidak memberikan analisis. Silakan coba lagi.');
        }

        // Strategy 1: Direct JSON parse
        $decoded = json_decode(trim($content), true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $this->validateAndEnhanceResponse($decoded);
        }

        // Strategy 2: Extract JSON from markdown
        $extracted = $this->extractJsonFromResponse($content);
        $decoded = json_decode($extracted, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $this->validateAndEnhanceResponse($decoded);
        }

        // Strategy 3: Sanitize and retry
        $sanitized = $this->sanitizeJsonString($extracted);
        $decoded = json_decode($sanitized, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $this->validateAndEnhanceResponse($decoded);
        }

        // Strategy 4: Text-based fallback
        Log::error('OpenRouter JSON parse failed', [
            'json_error' => json_last_error_msg(),
            'content_preview' => mb_substr($content, 0, 500),
        ]);

        return $this->buildTextFallbackResponse($content);
    }

    /**
     * Extract JSON from various response formats.
     */
    private function extractJsonFromResponse(string $raw): string
    {
        $raw = trim($raw);
        
        // Remove BOM
        $raw = preg_replace('/^[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\xEF\xBB\xBF]+/', '', $raw);

        // Pattern 1: ```json ... ```
        if (preg_match('/```json\s*([\s\S]*?)\s*```/i', $raw, $m) && !empty(trim($m[1]))) {
            return trim($m[1]);
        }

        // Pattern 2: ``` ... ``` (generic code block)
        if (preg_match('/```\s*([\s\S]*?)\s*```/', $raw, $m) && !empty(trim($m[1]))) {
            $inner = trim($m[1]);
            if (str_starts_with($inner, '{') || str_starts_with($inner, '[')) {
                return $inner;
            }
        }

        // Pattern 3: Find balanced { ... } block
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

        return $raw;
    }

    /**
     * Sanitize common JSON issues.
     */
    private function sanitizeJsonString(string $json): string
    {
        $json = preg_replace('/,\s*([}\]])/m', '$1', $json);  // Trailing commas
        $json = preg_replace('/\/\/[^\n]*/', '', $json);      // Single-line comments
        $json = str_replace(["\u{201C}", "\u{201D}", "\u{2018}", "\u{2019}"], '"', $json); // Smart quotes
        
        return trim($json);
    }

    /**
     * Validate and enhance parsed response.
     */
    private function validateAndEnhanceResponse(array $response): array
    {
        $defaults = [
            'confidence'          => 0.7,
            'action_required'     => false,
            'can_consult_chatbot' => true,
            'predicted_class'     => 'Normal',
        ];

        foreach ($defaults as $key => $default) {
            if (!isset($response[$key])) {
                $response[$key] = $default;
            }
        }

        if (!isset($response['recommendation'])) {
            $response['recommendation'] = $response['friendly_summary'] ?? 'Analisis selesai.';
        }

        return $response;
    }

    /**
     * Build text-based fallback response.
     */
    private function buildTextFallbackResponse(string $rawText): array
    {
        $lower = strtolower($rawText);

        $predictedClass = 'Normal';
        if (str_contains($lower, 'rabun jauh') || str_contains($lower, 'miopi')) {
            $predictedClass = (str_contains($lower, 'silinder') || str_contains($lower, 'astigmat')) 
                ? 'Rabun Jauh & Silinder' : 'Rabun Jauh';
        } elseif (str_contains($lower, 'rabun dekat') || str_contains($lower, 'hiper')) {
            $predictedClass = (str_contains($lower, 'silinder') || str_contains($lower, 'astigmat')) 
                ? 'Rabun Dekat & Silinder' : 'Rabun Dekat';
        } elseif (str_contains($lower, 'silinder') || str_contains($lower, 'astigmat')) {
            $predictedClass = 'Silinder';
        }

        $cleanText = preg_replace('/[{}\[\]":]/', '', $rawText);
        $cleanText = preg_replace('/\s+/', ' ', trim($cleanText));
        $recommendation = mb_substr($cleanText, 0, 300) ?: 
                         'Disarankan untuk melakukan pemeriksaan ke dokter mata.';

        return $this->buildFallbackResponse($predictedClass, $recommendation);
    }

    /**
     * Build standard fallback response.
     */
    private function buildFallbackResponse(string $predictedClass, string $recommendation): array
    {
        return [
            'predicted_class'    => $predictedClass,
            'confidence'         => 0.50,
            'visual_acuity'      => null,
            'snellen_decimal'    => null,
            'recommendation'     => $recommendation,
            'action_required'    => $predictedClass !== 'Normal',
            'can_consult_chatbot'=> true,
            'friendly_summary'   => $predictedClass !== 'Normal'
                ? "Hasil skrining: indikasi {$predictedClass}. Konsultasi ke dokter mata disarankan."
                : "Hasil skrining: mata dalam batas normal. Tetap jaga kesehatan mata!",
            'is_fallback'        => true,
        ];
    }
}