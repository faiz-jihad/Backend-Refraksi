<?php

declare(strict_types=1);

namespace App\Services\AI;

use App\Exceptions\GeminiException;
use App\Services\AI\Prompts\RefractionPrompt;
use App\Services\AI\Prompts\SnellenPrompt;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use InvalidArgumentException;
use Generator;

/**
 * GeminiService - AI-powered eye health analysis service
 * 
 * Handles all interactions with Google's Gemini AI API for:
 * - Refraction data analysis
 * - Snellen test interpretation
 * - Image analysis (multimodal)
 * - Conversational chat with history
 * - Streaming responses
 * 
 * Features:
 * - Retry logic with exponential backoff
 * - Circuit breaker pattern for high availability
 * - Multi-strategy JSON parsing
 * - Safety filter handling
 * - Comprehensive error management
 */
class GeminiService
{
    // API Configuration
    private string $apiKey;
    private string $model;
    private string $baseUrl;
    
    // Retry Configuration
    private int $maxRetries;
    private int $retryDelay; // milliseconds
    
    // Timeout Configuration
    private int $timeoutDefault;
    private int $timeoutImage;
    private int $timeoutStream;
    
    // Circuit Breaker Configuration
    private int $circuitBreakerThreshold;
    private int $circuitBreakerResetMinutes;
    
    // Cache Configuration
    private int $cacheDefaultTtl;
    private bool $cacheEnabled;

    /**
     * Initialize service with configuration from config/services.php
     */
    public function __construct()
    {
        $this->apiKey     = config('services.gemini.api_key');
        $this->model      = config('services.gemini.model', 'gemini-2.5-flash');
        $this->baseUrl    = config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');
        
        // Retry settings
        $this->maxRetries = config('services.gemini.max_retries', 3);
        $this->retryDelay = config('services.gemini.retry_delay', 1000);
        
        // Timeout settings
        $this->timeoutDefault = config('services.gemini.timeout_default', 30);
        $this->timeoutImage   = config('services.gemini.timeout_image', 60);
        $this->timeoutStream  = config('services.gemini.timeout_stream', 120);
        
        // Circuit breaker settings
        $this->circuitBreakerThreshold     = config('services.gemini.circuit_breaker_threshold', 5);
        $this->circuitBreakerResetMinutes  = config('services.gemini.circuit_breaker_reset_minutes', 5);
        
        // Cache settings
        $this->cacheDefaultTtl = config('services.gemini.cache_ttl', 3600);
        $this->cacheEnabled    = config('services.gemini.cache_enabled', true);
    }

    // ============================================================================
    // PUBLIC API METHODS
    // ============================================================================

    /**
     * Analyze eye refraction data using Gemini AI.
     *
     * @param array $refractionData Structured refraction examination data
     * @return array Structured analysis results
     * @throws GeminiException
     * @throws InvalidArgumentException
     */
    public function analyzeRefraction(array $refractionData): array
    {
        $this->validateRefractionData($refractionData);
        
        $prompt = RefractionPrompt::build($refractionData);
        
        $rawResponse = $this->generateContent($prompt, [
            'temperature'      => 0.3,
            'maxOutputTokens'  => 512,
            'responseMimeType' => 'application/json',
        ]);

        return $this->parseJsonResponse($rawResponse);
    }

    /**
     * Analyze Snellen test results using Gemini AI.
     *
     * @param array $snellenData Snellen test examination data
     * @param string|null $imageBase64 Optional base64 encoded image for multimodal analysis
     * @return array Structured analysis results
     * @throws GeminiException
     * @throws InvalidArgumentException
     */
    public function analyzeSnellen(array $snellenData, ?string $imageBase64 = null): array
    {
        $this->validateSnellenData($snellenData);
        
        $prompt = SnellenPrompt::build($snellenData);
        
        $jsonConfig = [
            'temperature'      => 0.2,
            'maxOutputTokens'  => 512,
            'responseMimeType' => 'application/json',
        ];

        if ($imageBase64) {
            $rawResponse = $this->generateMultimodalContent($prompt, $imageBase64, 'image/jpeg', $jsonConfig);
        } else {
            $rawResponse = $this->generateContent($prompt, $jsonConfig);
        }

        return $this->parseJsonResponse($rawResponse);
    }

    /**
     * Analyze image using Gemini's multimodal capabilities.
     *
     * @param string $imagePath Local path to image file
     * @param string $prompt Analysis prompt
     * @return array Structured analysis results
     * @throws GeminiException
     * @throws InvalidArgumentException
     */
    public function analyzeImage(string $imagePath, string $prompt): array
    {
        if (!file_exists($imagePath)) {
            throw new InvalidArgumentException('File gambar tidak ditemukan');
        }

        if (!is_readable($imagePath)) {
            throw new InvalidArgumentException('File gambar tidak dapat dibaca');
        }

        $imageData = base64_encode(file_get_contents($imagePath));
        $mimeType = mime_content_type($imagePath) ?: 'image/jpeg';

        if (!str_starts_with($mimeType, 'image/')) {
            throw new InvalidArgumentException('File harus berupa gambar');
        }

        // Validate image size (max 20MB for Gemini)
        if (strlen($imageData) > 20 * 1024 * 1024) {
            throw new InvalidArgumentException('Ukuran gambar terlalu besar (maksimal 20MB)');
        }

        $response = $this->generateMultimodalContent($prompt, $imageData, $mimeType, [
            'temperature'      => 0.2,
            'maxOutputTokens'  => 1024,
            'responseMimeType' => 'application/json',
        ]);

        return $this->parseJsonResponse($response);
    }

    /**
     * Chat with Gemini AI with conversation history support.
     *
     * @param string $message User message
     * @param array $history Chat history [['role' => 'user'|'model', 'content' => '...']]
     * @param array $options Additional generation config options
     * @return string AI response text
     * @throws GeminiException
     */
    public function chat(string $message, array $history = [], array $options = []): string
    {
        if (trim($message) === '') {
            throw new InvalidArgumentException('Pesan tidak boleh kosong');
        }

        // Validate message length
        if (strlen($message) > 5000) {
            throw new InvalidArgumentException('Pesan terlalu panjang (maksimal 5000 karakter)');
        }

        $contents = $this->buildChatContents($message, $history);

        $generationConfig = array_merge([
            'temperature'     => 0.7,
            'maxOutputTokens' => 1024,
        ], $options);

        return $this->generateContent($contents, $generationConfig, true);
    }

    /**
     * Stream chat response from Gemini AI (real-time).
     *
     * @param string $message User message
     * @param array $history Chat history
     * @return Generator Yields text chunks as they arrive
     * @throws GeminiException
     */
    public function streamChat(string $message, array $history = []): Generator
    {
        if (trim($message) === '') {
            throw new InvalidArgumentException('Pesan tidak boleh kosong');
        }

        $this->validateConfiguration();
        $this->checkCircuitBreaker();

        $contents = $this->buildChatContents($message, $history);

        $payload = [
            'contents' => $contents,
            'system_instruction' => $this->getSystemInstruction(),
            'generationConfig' => [
                'temperature'     => 0.7,
                'maxOutputTokens' => 1024,
            ],
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->timeout($this->timeoutStream)
            ->withOptions(['stream' => true])
            ->post(
                "{$this->baseUrl}/models/{$this->model}:streamGenerateContent?alt=sse&key={$this->apiKey}",
                $payload
            );

            if (!$response->successful()) {
                $this->handleApiError($response);
            }

            $body = $response->toPsrResponse()->getBody();
            $buffer = '';
            
            while (!$body->eof()) {
                $line = trim($body->readLine());
                $buffer .= $line;
                
                if (empty($line)) {
                    continue;
                }

                // Check for error in stream
                if (str_contains($line, '"error"')) {
                    $errorData = json_decode(substr($line, strpos($line, '{')), true);
                    Log::error('Gemini stream error', ['error' => $errorData ?? $line]);
                    throw new GeminiException(
                        'Error dalam streaming: ' . ($errorData['error']['message'] ?? 'Unknown error')
                    );
                }
                
                if (!str_starts_with($line, 'data: ')) {
                    continue;
                }

                $data = json_decode(substr($line, 6), true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::warning('Failed to parse stream chunk', [
                        'line' => $line,
                        'error' => json_last_error_msg()
                    ]);
                    continue;
                }

                // Handle safety filters in stream
                if (isset($data['candidates'][0]['finishReason'])) {
                    $finishReason = $data['candidates'][0]['finishReason'];
                    
                    if ($finishReason === 'SAFETY') {
                        Log::warning('Stream blocked by safety filter', [
                            'safety_ratings' => $data['candidates'][0]['safetyRatings'] ?? []
                        ]);
                        yield "\n\n[Konten tidak dapat ditampilkan karena kebijakan keamanan]";
                        return;
                    }
                    
                    if (!in_array($finishReason, ['STOP', 'MAX_TOKENS', ''])) {
                        Log::warning('Stream stopped unexpectedly', ['finish_reason' => $finishReason]);
                        yield "\n\n[Respons terhenti secara tidak terduga]";
                        return;
                    }
                }
                
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    yield $data['candidates'][0]['content']['parts'][0]['text'];
                }
            }
            
            // Reset circuit breaker on success
            $this->resetCircuitBreaker();
            
        } catch (ConnectionException $e) {
            $this->recordCircuitBreakerFailure();
            Log::error('Gemini streaming connection error', ['message' => $e->getMessage()]);
            throw new GeminiException('Gagal terhubung ke layanan AI untuk streaming');
        } catch (\Exception $e) {
            if ($e instanceof GeminiException) {
                throw $e;
            }
            Log::error('Gemini streaming unexpected error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new GeminiException('Gagal melakukan streaming chat');
        }
    }

    /**
     * Get cached analysis result.
     *
     * @param string $cacheKey Unique cache key
     * @param callable $callback Function to generate data if cache miss
     * @param int|null $ttl Cache TTL in seconds (null for default)
     * @return mixed
     */
    public function getCachedAnalysis(string $cacheKey, callable $callback, ?int $ttl = null): mixed
    {
        if (!$this->cacheEnabled) {
            return $callback();
        }

        $ttl = $ttl ?? $this->cacheDefaultTtl;
        
        return Cache::remember(
            "gemini_analysis_{$cacheKey}", 
            $ttl, 
            function () use ($callback) {
                return $callback();
            }
        );
    }

    // ============================================================================
    // VALIDATION METHODS
    // ============================================================================

    /**
     * Validate service configuration.
     *
     * @throws GeminiException
     */
    private function validateConfiguration(): void
    {
        if (empty($this->apiKey)) {
            throw new GeminiException(
                'Gemini API key tidak dikonfigurasi. Silakan set GEMINI_API_KEY di .env'
            );
        }

        if (empty($this->model)) {
            throw new GeminiException('Model Gemini tidak dikonfigurasi');
        }

        if (!str_starts_with($this->baseUrl, 'https://')) {
            throw new GeminiException('Base URL harus menggunakan HTTPS');
        }
    }

    /**
     * Validate refraction examination data.
     *
     * @param array $data Refraction data
     * @throws InvalidArgumentException
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

        // Validate numeric fields
        $numericFields = ['right_eye_sphere', 'left_eye_sphere', 'right_eye_cylinder', 'left_eye_cylinder'];
        foreach ($numericFields as $field) {
            if (isset($data[$field]) && !is_numeric($data[$field])) {
                throw new InvalidArgumentException(
                    "Field {$field} harus berupa angka"
                );
            }
        }
    }

    /**
     * Validate Snellen test data.
     *
     * @param array $data Snellen data
     * @throws InvalidArgumentException
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

        // Validate test_type
        $validTestTypes = ['distance', 'near', 'comprehensive'];
        if (!in_array($data['test_type'], $validTestTypes)) {
            throw new InvalidArgumentException(
                'Tipe tes tidak valid. Harus salah satu dari: ' . implode(', ', $validTestTypes)
            );
        }
    }

    // ============================================================================
    // CONTENT GENERATION METHODS
    // ============================================================================

    /**
     * Generate text content from Gemini API.
     *
     * @param string|array $promptOrContents Text prompt or array of contents for chat
     * @param array $generationConfig Generation configuration
     * @param bool $isChatMode Whether in chat mode (adds system instruction)
     * @return string Raw response text
     * @throws GeminiException
     */
    private function generateContent(
        string|array $promptOrContents,
        array $generationConfig = [],
        bool $isChatMode = false
    ): string {
        $this->validateConfiguration();
        $this->checkCircuitBreaker();

        $payload = $isChatMode
            ? ['contents' => $promptOrContents]
            : ['contents' => [['parts' => [['text' => $promptOrContents]]]]];

        // Add system instruction for chat mode
        if ($isChatMode) {
            $payload['system_instruction'] = $this->getSystemInstruction();
        }

        if (!empty($generationConfig)) {
            $payload['generationConfig'] = $generationConfig;
        }

        $response = $this->makeRequest($payload, $this->timeoutDefault);
        
        // Reset circuit breaker on success
        $this->resetCircuitBreaker();
        
        return $response;
    }

    /**
     * Generate multimodal content (text + image) from Gemini API.
     *
     * @param string $prompt Text prompt
     * @param string $imageData Base64 encoded image data
     * @param string $mimeType Image MIME type
     * @param array $generationConfig Generation configuration
     * @return string Raw response text
     * @throws GeminiException
     */
    private function generateMultimodalContent(
        string $prompt,
        string $imageData,
        string $mimeType,
        array $generationConfig = []
    ): string {
        $this->validateConfiguration();
        $this->checkCircuitBreaker();

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                        [
                            'inline_data' => [
                                'mime_type' => $mimeType,
                                'data'      => $imageData
                            ]
                        ]
                    ]
                ]
            ]
        ];

        if (!empty($generationConfig)) {
            $payload['generationConfig'] = $generationConfig;
        }

        $response = $this->makeRequest($payload, $this->timeoutImage);
        
        // Reset circuit breaker on success
        $this->resetCircuitBreaker();
        
        return $response;
    }

    /**
     * Build contents array for chat with history.
     *
     * @param string $message Current user message
     * @param array $history Chat history
     * @return array Formatted contents for API
     */
    private function buildChatContents(string $message, array $history): array
    {
        $contents = [];

        // Add conversation history
        foreach ($history as $msg) {
            if (!isset($msg['role'], $msg['content'])) {
                continue;
            }

            // Validate role
            $role = $msg['role'] === 'user' ? 'user' : 'model';
            
            $contents[] = [
                'role'  => $role,
                'parts' => [['text' => $msg['content']]]
            ];
        }

        // Add current message
        $contents[] = [
            'role'  => 'user',
            'parts' => [['text' => $message]]
        ];

        return $contents;
    }

    /**
     * Get system instruction for chat mode.
     *
     * @return array System instruction parts
     */
    private function getSystemInstruction(): array
    {
        return [
            'parts' => [
                [
                    'text' => "Anda adalah 'MataCeria AI', asisten kesehatan mata yang ramah, profesional, dan empatik. " .
                              "Anda membantu pengguna memahami kondisi kesehatan mata mereka dan memberikan informasi edukatif."
                ],
                [
                    'text' => "ATURAN BAHASA:\n" .
                              "- WAJIB gunakan Bahasa Indonesia dalam SETIAP respons, tanpa pengecualian.\n" .
                              "- Jangan pernah menjawab dalam bahasa Inggris atau bahasa lain.\n" .
                              "- Gunakan bahasa yang mudah dipahami oleh orang awam."
                ],
                [
                    'text' => "GAYA KOMUNIKASI:\n" .
                              "- Gunakan bahasa Indonesia yang santai tapi sopan.\n" .
                              "- Sapaan pembuka yang hangat seperti 'Halo Kak!'\n" .
                              "- Gunakan emoji secukupnya untuk membuat suasana lebih hangat (😊, 👁️, ✨, 💙).\n" .
                              "- Berikan motivasi atau kata penyemangat di akhir setiap respons.\n" .
                              "- Jika user bertanya di luar topik kesehatan mata, arahkan kembali dengan sopan."
                ],
                [
                    'text' => "FORMAT RESPONS:\n" .
                              "- Gunakan Markdown (bold, bullet points) agar tampilan di aplikasi rapi.\n" .
                              "- Pisahkan poin-poin penting dengan baris baru.\n" .
                              "- Berikan tips praktis yang bisa langsung dilakukan (contoh: aturan 20-20-20).\n" .
                              "- JANGAN memberikan diagnosa medis final, selalu sarankan konsultasi ke dokter."
                ],
                [
                    'text' => "BATASAN:\n" .
                              "- Jangan memberikan resep obat atau kacamata.\n" .
                              "- Selalu ingatkan bahwa analisis ini adalah skrining awal, bukan diagnosa medis.\n" .
                              "- Jika kondisi tampak serius, kuatkan saran untuk segera ke dokter mata."
                ]
            ]
        ];
    }

    // ============================================================================
    // HTTP REQUEST METHODS
    // ============================================================================

    /**
     * Make HTTP request to Gemini API with retry mechanism and error handling.
     *
     * @param array $payload Request payload
     * @param int $timeout Request timeout in seconds
     * @return string Response text
     * @throws GeminiException
     */
    private function makeRequest(array $payload, int $timeout = 30): string
    {
        $attempt = 0;
        $maxAttempts = $this->maxRetries + 1;
        $lastException = null;
        
        while ($attempt < $maxAttempts) {
            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->timeout($timeout)
                ->post(
                    "{$this->baseUrl}/models/{$this->model}:generateContent?key={$this->apiKey}",
                    $payload
                );

                // Handle successful response
                if ($response->successful()) {
                    return $this->extractResponseText($response->json());
                }

                // Handle rate limiting (429 Too Many Requests)
                if ($response->status() === 429) {
                    Log::error("Gemini rate limit hit (429) for model {$this->model}. Throwing exception immediately to trigger fast model fallback.");
                    throw new GeminiException('Terlalu banyak permintaan (429) ke Gemini AI. Beralih ke fallback.', 429);
                }

                // Handle server errors (5xx) - retryable
                if ($response->status() >= 500) {
                    Log::warning('Gemini server error, retrying', [
                        'status' => $response->status(),
                        'attempt' => $attempt + 1
                    ]);
                    
                    if ($attempt < $this->maxRetries) {
                        $this->exponentialBackoff($attempt);
                        $attempt++;
                        continue;
                    }
                }

                // Handle other errors
                $this->handleApiError($response);

            } catch (ConnectionException $e) {
                $lastException = $e;
                
                Log::error('Gemini connection error', [
                    'message' => $e->getMessage(),
                    'attempt' => $attempt + 1
                ]);
                
                if ($attempt < $this->maxRetries) {
                    $this->exponentialBackoff($attempt);
                    $attempt++;
                    continue;
                }
                
                $this->recordCircuitBreakerFailure();
                throw new GeminiException(
                    'Tidak dapat terhubung ke layanan AI. Silakan coba lagi nanti.'
                );
            }
            
            $attempt++;
        }

        // All retries exhausted
        $this->recordCircuitBreakerFailure();
        
        if ($lastException) {
            throw new GeminiException(
                'Layanan AI tidak tersedia setelah beberapa kali percobaan. Silakan coba nanti.',
                0,
                $lastException
            );
        }
        
        throw new GeminiException('Layanan AI sedang sibuk. Silakan coba beberapa saat lagi.');
    }

    /**
     * Extract text from Gemini API response.
     *
     * @param array $responseData Parsed JSON response
     * @return string Extracted text
     * @throws GeminiException
     */
    private function extractResponseText(array $responseData): string
    {
        // Validate response structure
        if (!isset($responseData['candidates']) || empty($responseData['candidates'])) {
            Log::error('Gemini returned no candidates', ['response' => $responseData]);
            throw new GeminiException('AI tidak menghasilkan respons');
        }

        $candidate = $responseData['candidates'][0];

        // Check finish reason
        $finishReason = $candidate['finishReason'] ?? 'UNKNOWN';
        
        if ($finishReason === 'SAFETY') {
            Log::warning('Gemini response blocked by safety filter', [
                'safety_ratings' => $candidate['safetyRatings'] ?? []
            ]);
            throw new GeminiException(
                'Konten tidak dapat ditampilkan karena kebijakan keamanan AI. ' .
                'Silakan gunakan bahasa yang lebih sopan dan sesuai.'
            );
        }

        if ($finishReason === 'RECITATION') {
            Log::warning('Gemini response blocked due to recitation');
            throw new GeminiException('AI tidak dapat menghasilkan respons orisinal');
        }

        if (!in_array($finishReason, ['STOP', 'MAX_TOKENS', ''])) {
            Log::error('Gemini response stopped unexpectedly', [
                'finish_reason' => $finishReason
            ]);
            throw new GeminiException('AI menghentikan respons secara tidak terduga');
        }

        // Extract text
        $text = $candidate['content']['parts'][0]['text'] ?? '';
        
        if (empty(trim($text))) {
            Log::error('Gemini returned empty text', [
                'candidate' => $candidate
            ]);
            throw new GeminiException('AI memberikan respons kosong');
        }

        return $text;
    }

    /**
     * Handle API error responses.
     *
     * @param mixed $response HTTP response
     * @throws GeminiException
     */
    private function handleApiError($response): void
    {
        $statusCode = $response->status();
        $errorBody = $response->json();
        $errorMessage = $errorBody['error']['message'] ?? 'Unknown error';

        Log::error('Gemini API error', [
            'status' => $statusCode,
            'error' => $errorMessage,
            'body' => $this->sanitizePayload($errorBody)
        ]);

        $userMessage = match ($statusCode) {
            400 => 'Permintaan tidak valid ke AI. Format data mungkin salah.',
            401 => 'Konfigurasi API key tidak valid. Hubungi administrator.',
            403 => 'Akses ke API ditolak. Periksa izin API key.',
            404 => 'Model AI tidak ditemukan. Periksa konfigurasi model.',
            413 => 'Ukuran permintaan terlalu besar.',
            429 => 'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.',
            500 => 'Layanan AI mengalami kesalahan internal.',
            502 => 'Layanan AI sedang dalam pemeliharaan.',
            503 => 'Layanan AI sedang sibuk. Silakan coba lagi nanti.',
            default => 'Layanan AI tidak tersedia saat ini. Kode error: ' . $statusCode
        };

        throw new GeminiException($userMessage, $statusCode);
    }

    /**
     * Apply exponential backoff delay.
     *
     * @param int $attempt Current attempt number (0-based)
     */
    private function exponentialBackoff(int $attempt): void
    {
        $delay = $this->retryDelay * (2 ** $attempt); // Exponential: 1s, 2s, 4s, 8s...
        $jitter = rand(0, 500); // Add jitter (±500ms) to prevent thundering herd
        
        usleep(($delay + $jitter) * 1000);
    }

    // ============================================================================
    // CIRCUIT BREAKER METHODS
    // ============================================================================

    /**
     * Check if circuit breaker is open (service considered unavailable).
     *
     * @throws GeminiException
     */
    private function checkCircuitBreaker(): void
    {
        if (!$this->isCircuitBreakerEnabled()) {
            return;
        }

        $failures = (int) Cache::get('gemini_circuit_failures', 0);
        $lastFailure = (int) Cache::get('gemini_circuit_last_failure', 0);

        if ($failures >= $this->circuitBreakerThreshold) {
            $resetTime = $lastFailure + ($this->circuitBreakerResetMinutes * 60);
            
            if (time() < $resetTime) {
                $remainingSeconds = $resetTime - time();
                throw new GeminiException(
                    sprintf(
                        'Layanan AI sedang tidak tersedia. Silakan coba lagi dalam %d menit %d detik.',
                        floor($remainingSeconds / 60),
                        $remainingSeconds % 60
                    )
                );
            }
            
            // Reset time has passed, clear circuit breaker
            $this->resetCircuitBreaker();
        }
    }

    /**
     * Record a failure for circuit breaker.
     */
    private function recordCircuitBreakerFailure(): void
    {
        if (!$this->isCircuitBreakerEnabled()) {
            return;
        }

        $failures = (int) Cache::get('gemini_circuit_failures', 0);
        Cache::put('gemini_circuit_failures', $failures + 1, now()->addHours(1));
        Cache::put('gemini_circuit_last_failure', time(), now()->addHours(1));
    }

    /**
     * Reset circuit breaker after successful request.
     */
    private function resetCircuitBreaker(): void
    {
        if (!$this->isCircuitBreakerEnabled()) {
            return;
        }

        Cache::forget('gemini_circuit_failures');
        Cache::forget('gemini_circuit_last_failure');
    }

    /**
     * Check if circuit breaker is enabled.
     *
     * @return bool
     */
    private function isCircuitBreakerEnabled(): bool
    {
        return $this->circuitBreakerThreshold > 0;
    }

    // ============================================================================
    // JSON PARSING METHODS
    // ============================================================================

    /**
     * Parse JSON response from Gemini with multi-strategy extraction.
     * Never throws exception — always returns valid array.
     *
     * @param string $raw Raw response text from Gemini
     * @return array Parsed JSON array
     */
    private function parseJsonResponse(string $raw): array
    {
        // Log raw response for debugging (truncated)
        Log::debug('Gemini raw response', [
            'length'  => strlen($raw),
            'preview' => mb_substr($raw, 0, 500),
        ]);

        if (empty(trim($raw))) {
            Log::error('Gemini returned completely empty response');
            return $this->buildFallbackResponse('Normal', 'AI tidak memberikan analisis. Silakan coba lagi.');
        }

        // Strategy 1: Direct JSON parse (for responseMimeType=application/json)
        $decoded = json_decode(trim($raw), true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $this->validateAndEnhanceResponse($decoded);
        }

        // Strategy 2: Extract JSON from markdown/mixed text
        $extracted = $this->extractJsonFromResponse($raw);
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

        // Strategy 4: Build fallback from text (graceful degradation)
        Log::error('Gemini JSON parse failed after all strategies', [
            'json_error' => json_last_error_msg(),
            'raw_preview' => mb_substr($raw, 0, 800),
        ]);

        return $this->buildTextFallbackResponse($raw);
    }

    /**
     * Extract JSON from various response formats.
     *
     * @param string $raw Raw response text
     * @return string Extracted JSON string
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

        // Pattern 2: ``` ... ``` (plain code block with JSON-like content)
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

                if ($escape) { 
                    $escape = false; 
                    continue; 
                }
                if ($ch === '\\' && $inStr) { 
                    $escape = true; 
                    continue; 
                }
                if ($ch === '"') { 
                    $inStr = !$inStr; 
                    continue; 
                }
                if ($inStr) {
                    continue;
                }

                if ($ch === '{') {
                    $depth++;
                } elseif ($ch === '}') {
                    $depth--;
                    if ($depth === 0) { 
                        $endPos = $i; 
                        break; 
                    }
                }
            }

            if ($endPos > $startPos) {
                return substr($raw, $startPos, $endPos - $startPos + 1);
            }
        }

        // Pattern 4: Return as-is
        return $raw;
    }

    /**
     * Sanitize common JSON formatting issues from Gemini output.
     *
     * @param string $json Potentially malformed JSON string
     * @return string Sanitized JSON string
     */
    private function sanitizeJsonString(string $json): string
    {
        // Remove trailing commas before } or ]
        $json = preg_replace('/,\s*([}\]])/m', '$1', $json);

        // Remove single-line comments (// ...)
        $json = preg_replace('/\/\/[^\n]*/', '', $json);

        // Replace curly/smart quotes with straight quotes
        $json = str_replace(
            ["\u{201C}", "\u{201D}", "\u{2018}", "\u{2019}", "\u{201A}", "\u{201B}"],
            '"',
            $json
        );

        // Fix common unicode issues
        $json = preg_replace('/[\x00-\x1F\x7F]/u', '', $json);

        return trim($json);
    }

    /**
     * Validate and enhance parsed JSON response.
     *
     * @param array $response Parsed response
     * @return array Enhanced response
     */
    private function validateAndEnhanceResponse(array $response): array
    {
        // Ensure required fields exist with defaults
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

        // Ensure recommendation field exists
        if (!isset($response['recommendation'])) {
            $response['recommendation'] = $response['friendly_summary'] ?? 'Analisis selesai.';
        }

        return $response;
    }

    /**
     * Build fallback response from raw text when JSON parsing fails.
     *
     * @param string $rawText Raw text response
     * @return array Structured fallback response
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

        // Try to extract only the recommendation content via regex
        $recommendation = '';
        if (preg_match('/(?:recommendation|rekomendasi|kondisi)\s*[:\-\s]+([\s\S]+?)(?=(?:action_required|friendly_summary|can_consult_chatbot|is_fallback|$))/i', $rawText, $matches)) {
            $recommendation = trim($matches[1]);
            $recommendation = rtrim($recommendation, '",\t\n\r ');
        } else {
            $cleanText = preg_replace('/[{}\[\]":]/', '', $rawText);
            $cleanText = preg_replace('/\s+/', ' ', trim($cleanText));
            $recommendation = mb_substr($cleanText, 0, 500) ?: 'Disarankan untuk melakukan pemeriksaan ke dokter mata.';
        }

        // Try to extract friendly summary
        $friendlySummary = null;
        if (preg_match('/friendly_summary\s*[:\-\s]+([\s\S]+?)(?=(?:action_required|can_consult_chatbot|is_fallback|$))/i', $rawText, $matches)) {
            $friendlySummary = trim($matches[1]);
            $friendlySummary = rtrim($friendlySummary, '",\t\n\r ');
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
     * Build standard fallback response structure.
     *
     * @param string $predictedClass Predicted condition class
     * @param string $recommendation Recommendation text
     * @return array Structured response
     */
    private function buildFallbackResponse(string $predictedClass, string $recommendation): array
    {
        $needAction = $predictedClass !== 'Normal';
        
        return [
            'predicted_class'    => $predictedClass,
            'confidence'         => 0.60,
            'visual_acuity'      => null,
            'snellen_decimal'    => null,
            'recommendation'     => $recommendation,
            'action_required'    => $needAction,
            'can_consult_chatbot'=> true,
            'friendly_summary'   => $needAction
                ? "Hasil skrining menunjukkan indikasi {$predictedClass}. Disarankan untuk konsultasi dengan dokter mata."
                : "Hasil skrining menunjukkan kondisi mata dalam batas normal. Tetap jaga kesehatan mata Anda!",
            'is_fallback'        => true, // Flag to indicate this is fallback
        ];
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    /**
     * Sanitize payload for safe logging (remove sensitive data).
     *
     * @param array $payload Request payload
     * @return array Sanitized payload
     */
    private function sanitizePayload(array $payload): array
    {
        $sanitized = json_decode(json_encode($payload), true);
        
        // Sanitize base64 image data
        if (isset($sanitized['contents'])) {
            array_walk_recursive($sanitized['contents'], function (&$value, $key) {
                if ($key === 'data' && is_string($value) && strlen($value) > 100) {
                    $value = '[BASE64_DATA_' . strlen($value) . '_BYTES]';
                }
            });
        }
        
        // Remove any API key if accidentally included
        if (isset($sanitized['api_key'])) {
            $sanitized['api_key'] = '[REDACTED]';
        }
        
        return $sanitized;
    }

    /**
     * Get service health status.
     *
     * @return array Health check information
     */
    public function healthCheck(): array
    {
        try {
            $this->validateConfiguration();
            
            $isCircuitOpen = $this->isCircuitBreakerEnabled() && 
                Cache::get('gemini_circuit_failures', 0) >= $this->circuitBreakerThreshold;
            
            return [
                'status'           => $isCircuitOpen ? 'degraded' : 'healthy',
                'api_key_set'      => !empty($this->apiKey),
                'model'            => $this->model,
                'circuit_breaker'  => [
                    'enabled'    => $this->isCircuitBreakerEnabled(),
                    'is_open'    => $isCircuitOpen,
                    'failures'   => Cache::get('gemini_circuit_failures', 0),
                    'threshold'  => $this->circuitBreakerThreshold,
                ],
                'cache_enabled'    => $this->cacheEnabled,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'unhealthy',
                'error'  => $e->getMessage(),
            ];
        }
    }

    /**
     * Clear all Gemini-related cache.
     */
    public function clearCache(): void
    {
        // This would require a cache tag implementation
        // Cache::tags('gemini')->flush();
        Cache::forget('gemini_circuit_failures');
        Cache::forget('gemini_circuit_last_failure');
    }
}