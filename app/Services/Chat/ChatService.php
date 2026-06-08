<?php

declare(strict_types=1);

namespace App\Services\Chat;

use App\Models\ChatSession;
use App\Repositories\Contracts\ChatRepositoryInterface;
use App\Services\AI\GeminiService;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ChatService
{
    public function __construct(
        private readonly ChatRepositoryInterface $repository,
        private readonly GeminiService $geminiService,
        private readonly \App\Services\AI\OpenRouterService $openRouterService
    ) {}

    /**
     * Get all chat sessions for a user.
     */
    public function getUserSessions(int $userId): Collection
    {
        return $this->repository->getSessionsByUserId($userId);
    }

    /**
     * Get message history for a session.
     */
    public function getSessionMessages(string $sessionId): Collection
    {
        $session = $this->repository->findBySessionId($sessionId);
        if (!$session) {
            return collect();
        }

        return $this->repository->getMessagesBySessionId($session->id);
    }

    /**
     * Send message and get AI response.
     */
    public function sendMessage(int $userId, string $message, ?string $sessionId = null): array
    {
        // 1. Get or create session
        $session = null;
        if ($sessionId) {
            $session = $this->repository->findBySessionId($sessionId);
        }

        if (!$session) {
            $session = $this->repository->createSession([
                'user_id' => $userId,
                'session_id' => $sessionId ?? Str::uuid()->toString(),
                'title' => Str::limit($message, 50),
            ]);
        }

        // 2. Get history
        $history = $this->repository->getMessagesBySessionId($session->id)
            ->map(fn($msg) => [
                'role' => $msg->role,
                'content' => $msg->content,
            ])
            ->toArray();

        // 3. Save user message
        $this->repository->saveMessage([
            'chat_session_id' => $session->id,
            'role' => 'user',
            'content' => $message,
        ]);

        // Simple RAG: Cari artikel yang relevan berdasarkan kata kunci di pesan
        $words = explode(' ', $message);
        $query = \App\Models\Article::query();
        $hasSearch = false;
        foreach ($words as $word) {
            $cleanedWord = trim($word);
            if (strlen($cleanedWord) > 3) {
                $query->orWhere('title', 'like', "%{$cleanedWord}%")
                      ->orWhere('content', 'like', "%{$cleanedWord}%");
                $hasSearch = true;
            }
        }
        
        $context = "";
        if ($hasSearch) {
            $articles = $query->limit(2)->get();
            if ($articles->isNotEmpty()) {
                $context = "Gunakan informasi dari artikel-artikel berikut untuk menjawab jika relevan:\n\n";
                foreach ($articles as $article) {
                    $context .= "=== Artikel: " . $article->title . " ===\n" . Str::limit($article->content, 500) . "\n\n";
                }
            }
        }

        $appInfo = "=== Informasi Aplikasi MataCeria ===\n" .
                   "Aplikasi 'MataCeria' adalah platform tes refraksi mandiri dan kesehatan mata berbasis AI.\n" .
                   "Fitur-fitur utama:\n" .
                   "1. Tes Rabun Jauh (Menggunakan Snellen Chart dengan deteksi jarak wajah dinamis).\n" .
                   "2. Tes Rabun Dekat (Membaca teks ukuran kecil untuk mengukur daya akomodasi).\n" .
                   "3. Tes Silinder (Astigmatism clock untuk mendeteksi kelainan kelengkungan kornea).\n" .
                   "4. Chatbot AI (Untuk konsultasi awal, tanya jawab seputar kesehatan mata, dan RAG artikel).\n" .
                   "5. Artikel Kesehatan Mata (Edukasi seputar perawatan mata).\n" .
                   "6. Kontak Darurat (Daftar RS & Klinik Mata terdekat).\n\n";

        // Get latest refraction result for the user
        $latestTest = \App\Models\RefractionResult::where('user_id', $userId)
            ->latest()
            ->first();

        $testContext = "";
        if ($latestTest) {
            $recommendations = $latestTest->ai_recommendations;
            if (is_array($recommendations)) {
                // Handle nested arrays (e.g. [["saran1"], ["saran2"]])
                $recommendationText = implode("\n", array_map(
                    fn($r) => is_array($r) ? implode(', ', $r) : (string)($r ?? ''),
                    $recommendations
                ));
            } else {
                $recommendationText = (string)($recommendations ?? '-');
            }

            $testContext = "=== Hasil Tes Terakhir Pengguna ===\n" .
                           "Visus / Ketajaman: "       . (string)($latestTest->visual_acuity     ?? '-') . "\n" .
                           "Mata Kanan (Sphere): "     . (string)($latestTest->right_eye_sphere   ?? '-') . "\n" .
                           "Mata Kiri (Sphere): "      . (string)($latestTest->left_eye_sphere    ?? '-') . "\n" .
                           "Mata Kanan (Cylinder): "   . (string)($latestTest->right_eye_cylinder ?? '-') . "\n" .
                           "Mata Kiri (Cylinder): "    . (string)($latestTest->left_eye_cylinder  ?? '-') . "\n" .
                           "Rekomendasi AI: "          . $recommendationText . "\n\n";
        }

        $augmentedMessage = $appInfo . $testContext . $message;
        if ($context) {
            $augmentedMessage = $appInfo . $testContext . $context . "Pertanyaan Pengguna: " . $message;
        }

        // 4. Get AI response (Menggunakan Mock jika USE_MOCK_CHAT = true agar hemat kuota)
        if (env('USE_MOCK_CHAT', false)) {
            $aiResponseContent = "🤖 [MOCK MODE] Halo! Ini adalah respon otomatis untuk menghemat kuota Gemini Kak.\n\n";
            
            $msgLower = strtolower($message);
            if (str_contains($msgLower, 'mata')) {
                $aiResponseContent .= "Untuk menjaga kesehatan mata, pastikan Anda tidak menatap layar terlalu lama dan gunakan aturan 20-20-20 (Setiap 20 menit, tatap objek berjarak 20 kaki selama 20 detik).";
            } else if (str_contains($msgLower, 'tes') || str_contains($msgLower, 'periksa')) {
                $aiResponseContent .= "Anda bisa melakukan tes mata mandiri di aplikasi ini. Kami menyediakan Tes Rabun Jauh (Snellen), Tes Rabun Dekat, dan Tes Silinder.";
            } else if (str_contains($msgLower, 'halo') || str_contains($msgLower, 'hai')) {
                $aiResponseContent .= "Halo! Ada yang bisa saya bantu seputar kesehatan mata Anda?";
            } else {
                $aiResponseContent .= "Saya mengerti pertanyaan Anda tentang: \"$message\". Namun saat ini saya dalam mode hemat kuota (Mock). Silakan tanyakan hal seputar kesehatan mata agar saya bisa memberikan tips umum!";
            }
        } else {
            try {
                $aiResponseContent = $this->geminiService->chat($augmentedMessage, $history);
            } catch (\Exception $e) {
                // Try OpenRouter fallback
                try {
                    $aiResponseContent = $this->openRouterService->chat($augmentedMessage, $history);
                } catch (\Exception $e2) {
                    $aiResponseContent = "🤖 [MOCK MODE - API LIMIT] Halo! Maaf saat ini layanan AI kami sedang padat. Ini adalah respon otomatis untuk membantu Kak.\n\n" .
                        "Untuk menjaga kesehatan mata, pastikan Anda tidak menatap layar terlalu lama dan gunakan aturan 20-20-20.";
                }
            }
        }

        // 5. Save AI message
        $this->repository->saveMessage([
            'chat_session_id' => $session->id,
            'role' => 'model',
            'content' => $aiResponseContent,
        ]);

        $botResponse = [
            'id' => \Illuminate\Support\Str::random(10), // Mock ID for frontend
            'role' => 'model',
            'content' => $aiResponseContent,
            'timestamp' => now()->toIso8601String(),
            'session_id' => $session->session_id,
        ];

        // Broadcast the message via WebSocket (non-blocking)
        try {
            event(new \App\Events\MessageSent($botResponse));
        } catch (\Exception $broadcastEx) {
            \Illuminate\Support\Facades\Log::warning('Broadcasting failed, ignoring.', ['error' => $broadcastEx->getMessage()]);
        }

        return [
            'session_id' => $session->session_id,
            'bot_response' => $botResponse
        ];
    }

    /**
     * Update message feedback.
     */
    public function updateFeedback(int $messageId, bool $isHelpful, ?string $note = null): bool
    {
        return $this->repository->updateMessageFeedback($messageId, $isHelpful, $note);
    }

    /**
     * Delete a chat session.
     */
    public function deleteSession(string $sessionId): bool
    {
        return $this->repository->deleteSession($sessionId);
    }
}
