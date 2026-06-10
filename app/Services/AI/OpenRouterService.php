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
        'meta-llama/llama-3.3-70b-instruct:free',            // Llama 3.3 70B
        'deepseek/deepseek-r1-distill-llama-70b:free',       // DeepSeek R1 70B (distilled)
        'qwen/qwen-2.5-72b-instruct:free',                   // Qwen 2.5 72B
        'meta-llama/llama-3.2-3b-instruct:free',             // Llama 3.2 3B (ringan)
        'openrouter/free',                                   // OpenRouter Free Auto-Router (Catch-all)
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
        
        $models = $this->getModelsToTry();
        $lastException = null;

        foreach ($models as $currentModel) {
            try {
                $payload = [
                    'model'       => $currentModel,
                    'messages'    => $messages,
                    'temperature' => 0.2,      // Low temperature for consistent JSON
                    'max_tokens'  => 1500,
                    'response_format' => ['type' => 'json_object'], // OpenRouter supports this for some models
                ];

                Log::info("OpenRouter structured request attempt", ['model' => $currentModel]);
                
                return $this->sendChatRequest($payload);
                
            } catch (GeminiException $e) {
                Log::warning("OpenRouter structured request failed for {$currentModel}: " . $e->getMessage());
                $lastException = $e;
                continue;
            } catch (\Exception $e) {
                Log::error("OpenRouter structured request unexpected error for {$currentModel}: " . $e->getMessage());
                $lastException = new GeminiException(
                    "Gagal terhubung ke OpenRouter ({$currentModel}): " . $e->getMessage()
                );
                continue;
            }
        }

        throw $lastException ?? new GeminiException(
            'Semua model OpenRouter tidak tersedia untuk analisis struktural.'
        );
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
                    Log::error("OpenRouter rate limit hit for {$payload['model']}, skipping to next model immediately");
                    throw new GeminiException("Rate limit hit (429) untuk model {$payload['model']}, beralih ke model lain.", 429);
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

TABEL ACUAN ESTIMASI DIOPTRIS PLUS (Presbiopi / Rabun Dekat):
- N5: 0.00 (Normal)
- N6: Sekitar +1.00 Dioptri
- N8: Sekitar +1.50 Dioptri
- N10: Sekitar +2.00 Dioptri
- N12: Sekitar +2.50 Dioptri atau lebih

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

        // Escape raw newlines, carriage returns, and tabs inside double quotes
        $json = preg_replace_callback('/"([^"\\\\]*|\\\\.)*"/s', function ($matches) {
            return str_replace(["\n", "\r", "\t"], ["\\n", "\\r", "\\t"], $matches[0]);
        }, $json);
        
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
        $hasAstigmatism = $this->hasAstigmatism($rawText);

        if (str_contains($lower, 'rabun jauh') || str_contains($lower, 'miopi') || str_contains($lower, 'myopia')) {
            $predictedClass = $hasAstigmatism ? 'Rabun Jauh & Silinder' : 'Rabun Jauh';
        } elseif (str_contains($lower, 'rabun dekat') || str_contains($lower, 'hiper') || str_contains($lower, 'presbi')) {
            $predictedClass = $hasAstigmatism ? 'Rabun Dekat & Silinder' : 'Rabun Dekat';
        } elseif ($hasAstigmatism) {
            $predictedClass = 'Silinder';
        }

        // Default clean recommendations based on predicted class
        $defaultRecommendations = [
            'Normal' => 'Hasil skrining menunjukkan kondisi mata Anda dalam batas normal. Tetap jaga kesehatan mata dengan mengonsumsi makanan bergizi dan mengistirahatkan mata secara berkala.',
            'Rabun Jauh' => 'Hasil skrining menunjukkan adanya indikasi Rabun Jauh (Miopi). Disarankan untuk berkonsultasi dengan dokter spesialis mata atau optometris terdekat untuk mendapatkan pemeriksaan refraksi lengkap dan lensa korektif yang tepat.',
            'Rabun Dekat' => 'Hasil skrining menunjukkan adanya indikasi Rabun Dekat (Presbiopi atau Hipermetropi). Disarankan untuk melakukan pemeriksaan mata lebih lanjut guna mendapatkan resep kacamata baca yang sesuai.',
            'Silinder' => 'Hasil skrining menunjukkan adanya indikasi Astigmatisme (Silinder). Disarankan untuk berkonsultasi dengan dokter spesialis mata untuk mendapatkan lensa silinder agar penglihatan lebih fokus dan tidak berbayang.',
            'Rabun Jauh & Silinder' => 'Hasil skrining menunjukkan adanya kombinasi Rabun Jauh dan Silinder (Miopi & Astigmatisme). Disarankan untuk segera melakukan pemeriksaan mata lengkap guna mendapatkan lensa korektif yang sesuai.',
            'Rabun Dekat & Silinder' => 'Hasil skrining menunjukkan adanya kombinasi Rabun Dekat dan Silinder (Presbiopi & Astigmatisme). Disarankan untuk segera melakukan pemeriksaan mata lengkap guna mendapatkan lensa korektif yang sesuai.',
        ];

        // Try to extract only the recommendation content via regex
        $recommendation = '';
        $matched = false;
        if (preg_match('/(?:"recommendation"|recommendation|rekomendasi|kondisi)\s*[:\-\s\t"]+([\s\S]+?)(?=(?:"?action_required|"?friendly_summary|"?can_consult_chatbot|"?is_fallback|$))/i', $rawText, $matches)) {
            $recommendation = trim($matches[1]);
            $recommendation = rtrim($recommendation, '",\t\n\r ');
            
            // If the matched recommendation contains JSON keys (e.g. matched too much), treat as unmatched
            if (preg_match('/(?:"predicted_class"|"?confidence"|"?action_required"|"?friendly_summary")/i', $recommendation)) {
                $matched = false;
            } else {
                $matched = true;
            }
        }

        if (!$matched) {
            $hasJsonKeys = (str_contains($rawText, 'predicted_class') || str_contains($rawText, 'confidence') || str_contains($rawText, 'recommendation'));
            if ($hasJsonKeys) {
                $recommendation = $defaultRecommendations[$predictedClass] ?? 'Disarankan untuk melakukan pemeriksaan ke dokter mata.';
            } else {
                $cleanText = preg_replace('/[{}\[\]":]/', '', $rawText);
                $cleanText = preg_replace('/\s+/', ' ', trim($cleanText));
                $recommendation = mb_substr($cleanText, 0, 500) ?: 'Disarankan untuk melakukan pemeriksaan ke dokter mata.';
            }
        }

        // Try to extract friendly summary
        $friendlySummary = null;
        if (preg_match('/(?:"friendly_summary"|friendly_summary)\s*[:\-\s\t"]+([\s\S]+?)(?=(?:"?action_required|"?can_consult_chatbot|"?is_fallback|$))/i', $rawText, $matches)) {
            $friendlySummary = trim($matches[1]);
            $friendlySummary = rtrim($friendlySummary, '",\t\n\r ');
            
            // Discard friendly summary if it contains JSON structural keys
            if (preg_match('/(?:"predicted_class"|"?confidence"|"?recommendation"|"?action_required")/i', $friendlySummary)) {
                $friendlySummary = null;
            }
        }

        $response = $this->buildFallbackResponse($predictedClass, $recommendation);
        if ($friendlySummary) {
            $response['friendly_summary'] = $friendlySummary;
        }

        return $response;
    }

    /**
     * Helper to check for astigmatism while ignoring negative prefixes.
     */
    private function hasAstigmatism(string $text): bool
    {
        $lower = strtolower($text);
        if (str_contains($lower, 'astigmat') || str_contains($lower, 'silinder')) {
            if (preg_match('/(?:tidak|bukan|tanpa|no|negatif|tidak\s+terdeteksi)\s+(?:ada\s+)?(?:indikasi\s+)?(?:astigmat|silinder)/i', $lower)) {
                return false;
            }
            return true;
        }
        return false;
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
