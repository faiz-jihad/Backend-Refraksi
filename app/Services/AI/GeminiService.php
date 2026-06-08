<?php

declare(strict_types=1);

namespace App\Services\AI;

use App\Exceptions\GeminiException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use InvalidArgumentException;

class GeminiService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;
    private int $maxRetries;
    private int $retryDelay;

    public function __construct()
    {
        $this->apiKey     = config('services.gemini.api_key');
        $this->model      = config('services.gemini.model', 'gemini-1.5-flash');
        $this->baseUrl    = config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');
        $this->maxRetries = config('services.gemini.max_retries', 3);
        $this->retryDelay = config('services.gemini.retry_delay', 1000); // milliseconds
    }

    /**
     * Validasi konfigurasi API key.
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
    }

    /**
     * Analisis data refraksi mata menggunakan Gemini AI.
     *
     * @param array $refractionData Data refraksi yang akan dianalisis
     * @return array Hasil analisis terstruktur
     * @throws GeminiException
     * @throws InvalidArgumentException
     */
    public function analyzeRefraction(array $refractionData): array
    {
        $this->validateRefractionData($refractionData);
        
        $prompt = $this->buildRefractionPrompt($refractionData);
        $rawResponse = $this->generateContent($prompt, [
            'temperature'        => 0.3,
            'maxOutputTokens'    => 512,
            'responseMimeType'   => 'application/json',
        ]);

        return $this->parseJsonResponse($rawResponse);
    }

    /**
     * Analisis data Snellen Test menggunakan Gemini AI.
     */
    public function analyzeSnellen(array $snellenData, ?string $imageBase64 = null): array
    {
        $prompt = $this->buildSnellenPrompt($snellenData);
        
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
     * Validasi data refraksi sebelum dikirim ke AI.
     *
     * @throws InvalidArgumentException
     */
    private function validateRefractionData(array $data): void
    {
        $requiredFields = ['right_eye_sphere', 'left_eye_sphere', 'visual_acuity'];
        
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                throw new InvalidArgumentException("Data refraksi tidak lengkap: {$field} harus diisi");
            }
        }
    }

    /**
     * Build prompt terstruktur untuk analisis refraksi.
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

PEDOMAN ANALISIS:
- Sphere (S) Minus (-): Rabun Jauh (Miopi). Jarak pandang jauh kabur.
- Sphere (S) Plus (+): Rabun Dekat (Hipermetropi/Presbiopi). Jarak pandang dekat kabur.
- Cylinder (C): Astigmatisme (Mata Silinder). Pandangan berbayang atau garis tidak lurus.
- Visual Acuity: Tajam penglihatan (misal 20/20 adalah normal).

DATA REFRAKSI:
{$formatted}

FORMAT RESPONS (JSON valid):
{
  "kondisi": "Deskripsi singkat dan ramah (misal: 'Halo Kak! Sepertinya Anda mengalami Rabun Jauh ringan...')",
  "kategori": "Normal | Rabun Jauh | Rabun Dekat | Silinder | Komplikasi",
  "tingkat_keparahan": "Normal | Ringan | Sedang | Berat",
  "rekomendasi": ["Saran praktis 1", "Saran praktis 2"],
  "saran_kacamata": "Penjelasan mengenai lensa yang dibutuhkan",
  "perlu_ke_dokter": true,
  "tips_kesehatan": "Tips menjaga kesehatan mata (misal: aturan 20-20-20)",
  "pesan_motivasi": "Kata-kata penyemangat",
  "friendly_summary": "Ringkasan sangat singkat (1-2 kalimat) yang dioptimalkan untuk dibacakan oleh Text-to-Speech (TTS)."
}
PROMPT;
    }

    /**
     * Build prompt untuk analisis Snellen Test.
     */
    private function buildSnellenPrompt(array $data): string
    {
        $formatted = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        // Extract key values for clear guidance
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
- Skor Snellen terkecil yang terbaca: 20/{$smallestRow} (makin besar angka kedua = makin kabur jauh)
  → 20/20: Normal, 20/30-40: Ringan, 20/50-70: Sedang, 20/100+: Berat (indikasi Rabun Jauh/Miopi)
- Poin ketajaman dekat terkecil yang terbaca: N{$smallestN}
  → N5: Normal, N6-8: Ringan, N10-12: Signifikan (indikasi Rabun Dekat/Hipermetropi/Presbiopi)
- Indikasi Silinder/Astigmatisme dari tes dial: {$astigmatism}
- Hasil tes duochrome (koreksi refraksi): {$duochrome}
  → Jika 'red' dominan: over-corrected atau Rabun Dekat. Jika 'green' dominan: under-corrected atau Rabun Jauh.
  → Jika 'equal': refraksi sudah tepat.

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
  "friendly_summary": "Ringkasan hasil tes dalam 1-2 kalimat ramah yang dioptimalkan untuk Text-to-Speech."
}
PROMPT;
    }

    /**
     * Analisis gambar menggunakan Gemini AI dengan multimodal capabilities.
     *
     * @param string $imagePath Path ke file gambar
     * @param string $prompt Prompt untuk analisis gambar
     * @return array Hasil analisis terstruktur
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

        // Validasi mime type
        if (!str_starts_with($mimeType, 'image/')) {
            throw new InvalidArgumentException('File harus berupa gambar');
        }

        $response = $this->generateMultimodalContent($prompt, $imageData, $mimeType, [
            'temperature'      => 0.2,
            'maxOutputTokens'  => 1024,
            'responseMimeType' => 'application/json',
        ]);

        return $this->parseJsonResponse($response);
    }

    /**
     * Chat menggunakan Gemini AI dengan riwayat percakapan.
     *
     * @param string $message Pesan dari user
     * @param array $history Riwayat percakapan [['role' => 'user'|'model', 'content' => '...']]
     * @param array $options Opsi tambahan untuk generation config
     * @return string Respons dari AI
     * @throws GeminiException
     */
    public function chat(string $message, array $history = [], array $options = []): string
    {
        if (trim($message) === '') {
            throw new InvalidArgumentException('Pesan tidak boleh kosong');
        }

        $contents = $this->buildChatContents($message, $history);

        $generationConfig = array_merge([
            'temperature'     => 0.7,
            'maxOutputTokens' => 1024,
        ], $options);

        return $this->generateContent($contents, $generationConfig, true);
    }

    /**
     * Build contents array untuk chat dengan history.
     */
    private function buildChatContents(string $message, array $history): array
    {
        $contents = [];

        foreach ($history as $msg) {
            if (!isset($msg['role'], $msg['content'])) {
                continue;
            }

            $contents[] = [
                'role'  => $msg['role'] === 'user' ? 'user' : 'model',
                'parts' => [['text' => $msg['content']]]
            ];
        }

        $contents[] = [
            'role'  => 'user',
            'parts' => [['text' => $message]]
        ];

        return $contents;
    }

    /**
     * Generate content dari Gemini API dengan retry logic.
     *
     * @param string|array $promptOrContents Prompt string atau array contents
     * @param array $generationConfig Konfigurasi untuk generation
     * @param bool $isChatMode Apakah dalam mode chat
     * @return string Raw response text
     * @throws GeminiException
     */
    private function generateContent(
        string|array $promptOrContents,
        array $generationConfig = [],
        bool $isChatMode = false
    ): string {
        $this->validateConfiguration();

        $payload = $isChatMode
            ? ['contents' => $promptOrContents]
            : ['contents' => [['parts' => [['text' => $promptOrContents]]]]];

        if ($isChatMode) {
            $payload['system_instruction'] = [
                'parts' => [
                    ['text' => "Anda adalah 'MataCeria AI', asisten kesehatan mata yang ramah, profesional, dan empatik.

                    BAHASA:
                    - WAJIB gunakan Bahasa Indonesia dalam SETIAP respons, tanpa pengecualian.
                    - Jangan pernah menjawab dalam bahasa Inggris atau bahasa lain.

                    GAYA KOMUNIKASI:
                    - Gunakan bahasa Indonesia yang santai tapi sopan (sapaan: 'Halo Kak!', penutup: 'Semoga sehat selalu! 😊').
                    - Gunakan emoji secukupnya untuk membuat suasana lebih hangat (😊, 👁️, ✨, 💙).
                    - Berikan motivasi atau kata penyemangat di akhir setiap respons.
                    - Jika user bertanya di luar topik kesehatan mata, arahkan kembali dengan sopan.

                    FORMAT RESPONS:
                    - Gunakan Markdown (bold, bullet points) agar tampilan di aplikasi rapi.
                    - Pisahkan poin-poin penting dengan baris baru.
                    - Berikan tips praktis yang bisa langsung dilakukan (contoh: aturan 20-20-20)."]
                ]
            ];
        }

        if (!empty($generationConfig)) {
            $payload['generationConfig'] = $generationConfig;
        }

        return $this->makeRequest($payload);
    }

    /**
     * Generate multimodal content (text + image).
     */
    private function generateMultimodalContent(
        string $prompt,
        string $imageData,
        string $mimeType,
        array $generationConfig = []
    ): string {
        $this->validateConfiguration();

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

        return $this->makeRequest($payload, 60); // Longer timeout for images
    }

    /**
     * Make HTTP request to Gemini API with retry mechanism.
     *
     * @param array $payload Request payload
     * @param int $timeout Timeout dalam detik
     * @return string Response text
     * @throws GeminiException
     */
    private function makeRequest(array $payload, int $timeout = 30): string
    {
        $attempt = 0;
        
        do {
            try {
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->timeout($timeout)
                ->retry($this->maxRetries, $this->retryDelay)
                ->post(
                    "{$this->baseUrl}/models/{$this->model}:generateContent?key={$this->apiKey}",
                    $payload
                );

                if ($response->successful()) {
                    $text = $response->json('candidates.0.content.parts.0.text', '');
                    
                    if (empty($text)) {
                        Log::warning('Gemini returned empty response', [
                            'payload' => $this->sanitizePayload($payload),
                            'response' => $response->json()
                        ]);
                        throw new GeminiException('AI tidak memberikan respons');
                    }
                    
                    return $text;
                }

                // Handle rate limiting
                if ($response->status() === 429) {
                    $retryAfter = $response->header('Retry-After', $this->retryDelay / 1000);
                    Log::warning('Gemini rate limit hit, retrying', [
                        'retry_after' => $retryAfter,
                        'attempt' => $attempt
                    ]);
                    sleep((int) $retryAfter);
                    continue;
                }

                // Handle other errors
                $this->handleApiError($response);

            } catch (ConnectionException $e) {
                Log::error('Gemini connection error', [
                    'message' => $e->getMessage(),
                    'attempt' => $attempt
                ]);
                
                if ($attempt >= $this->maxRetries) {
                    throw new GeminiException(
                        'Tidak dapat terhubung ke layanan AI. Silakan coba lagi nanti.'
                    );
                }
                
                usleep($this->retryDelay * 1000);
            }
            
            $attempt++;
        } while ($attempt <= $this->maxRetries);

        throw new GeminiException('Layanan AI sedang sibuk. Silakan coba beberapa saat lagi.');
    }

    /**
     * Handle API error responses.
     *
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
            'body' => $errorBody
        ]);

        $userMessage = match ($statusCode) {
            400 => 'Permintaan tidak valid ke AI',
            401, 403 => 'Konfigurasi API key tidak valid',
            404 => 'Model AI tidak ditemukan',
            429 => 'Terlalu banyak permintaan. Silakan coba lagi nanti',
            500, 502, 503 => 'Layanan AI sedang mengalami gangguan',
            default => 'Layanan AI tidak tersedia saat ini'
        };

        throw new GeminiException($userMessage, $statusCode);
    }

    /**
     * Sanitize payload untuk logging (hide sensitive data).
     */
    private function sanitizePayload(array $payload): array
    {
        // Deep clone untuk menghindari modifikasi original
        $sanitized = json_decode(json_encode($payload), true);
        
        // Sanitasi base64 image data jika ada
        if (isset($sanitized['contents'][0]['parts'])) {
            foreach ($sanitized['contents'][0]['parts'] as &$part) {
                if (isset($part['inline_data']['data'])) {
                    $part['inline_data']['data'] = '[BASE64_IMAGE_DATA_' . strlen($part['inline_data']['data']) . '_BYTES]';
                }
            }
        }
        
        return $sanitized;
    }

    /**
     * Parse JSON response dari Gemini dengan multi-strategy extraction.
     * Tidak pernah throw exception — selalu kembalikan array valid.
     */
    private function parseJsonResponse(string $raw): array
    {
        // Log raw response for debugging
        Log::info('Gemini Raw Response:', [
            'length'  => strlen($raw),
            'preview' => mb_substr($raw, 0, 500),
        ]);

        if (empty(trim($raw))) {
            Log::warning('Gemini returned completely empty response');
            return $this->buildFallbackResponse('Normal', 'AI tidak memberikan analisis. Silakan coba lagi.');
        }

        // Strategy 1: Response is already pure JSON (via responseMimeType=application/json)
        $decoded = json_decode(trim($raw), true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        // Strategy 2: Extract JSON from various formats (markdown, mixed text)
        $extracted = $this->extractJsonFromResponse($raw);
        $decoded = json_decode($extracted, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        // Strategy 3: Sanitize and try again
        $sanitized = $this->sanitizeJsonString($extracted);
        $decoded = json_decode($sanitized, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        // Strategy 4: Build structured response from raw text (graceful degradation)
        Log::warning('Gemini JSON Parse failed after all strategies — using text-based fallback', [
            'json_error' => json_last_error_msg(),
            'raw'        => mb_substr($raw, 0, 800),
        ]);

        return $this->buildTextFallbackResponse($raw);
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
     * Sanitize common JSON issues from Gemini output.
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
            'confidence'        => 0.70,
            'visual_acuity'     => null,
            'snellen_decimal'   => null,
            'recommendation'    => $recommendation,
            'action_required'   => $predictedClass !== 'Normal',
            'can_consult_chatbot' => true,
            'friendly_summary'  => 'Hasil analisis menunjukkan kondisi ' . $predictedClass . '. Silakan konsultasikan dengan dokter mata untuk pemeriksaan lebih lanjut.',
        ];
    }

    /**
     * Streaming chat response (untuk real-time chat).
     *
     * @param string $message Pesan user
     * @param array $history Riwayat percakapan
     * @return \Generator String chunks dari respons
     * @throws GeminiException
     */
    public function streamChat(string $message, array $history = []): \Generator
    {
        $this->validateConfiguration();

        $contents = $this->buildChatContents($message, $history);

        $payload = [
            'contents' => $contents,
            'generationConfig' => [
                'temperature'     => 0.7,
                'maxOutputTokens' => 1024,
            ],
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->timeout(60)
            ->withOptions(['stream' => true])
            ->post(
                "{$this->baseUrl}/models/{$this->model}:streamGenerateContent?alt=sse&key={$this->apiKey}",
                $payload
            );

            $body = $response->toPsrResponse()->getBody();
            
            while (!$body->eof()) {
                $line = trim($body->readLine());
                
                if (empty($line) || !str_starts_with($line, 'data: ')) {
                    continue;
                }

                $data = json_decode(substr($line, 6), true);
                
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    yield $data['candidates'][0]['content']['parts'][0]['text'];
                }
            }
        } catch (\Exception $e) {
            Log::error('Gemini streaming error', ['message' => $e->getMessage()]);
            throw new GeminiException('Gagal melakukan streaming chat');
        }
    }

    /**
     * Caching wrapper untuk response yang sering digunakan.
     */
    public function getCachedAnalysis(string $cacheKey, callable $callback, int $ttl = 3600): mixed
    {
        return Cache::remember("gemini_analysis_{$cacheKey}", $ttl, function () use ($callback) {
            return $callback();
        });
    }
}