<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\Chat\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function __construct(
        private readonly ChatService $chatService
    ) {}

    /**
     * Get list of chat sessions.
     */
    public function sessions(Request $request): JsonResponse
    {
        $sessions = $this->chatService->getUserSessions($request->user()->id);
        
        // Transform for frontend
        $transformed = $sessions->map(fn($s) => [
            'session_id' => $s->session_id,
            'title' => $s->title,
            'updated_at' => $s->updated_at->toIso8601String(),
            'message_count' => $s->messages_count ?? 0,
            'duration' => '5m', // Mock duration
        ]);

        return ApiResponse::success($transformed);
    }

    /**
     * Get messages for a specific session.
     */
    public function messages(Request $request, string $sessionId): JsonResponse
    {
        $messages = $this->chatService->getSessionMessages($sessionId);
        
        $transformed = $messages->map(fn($m) => [
            'id' => $m->id,
            'role' => $m->role,
            'content' => $m->content,
            'timestamp' => $m->created_at->toIso8601String(),
            'is_helpful' => $m->is_helpful,
            'feedback_note' => $m->feedback_note,
        ]);

        return ApiResponse::success($transformed);
    }

    /**
     * Send a message to the chatbot.
     */
    public function send(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string',
            'session_id' => 'nullable|string',
        ]);

        $user = $request->user();
        
        // Rate Limiter: Maksimal 10x per hari untuk role 'user'
        if ($user->role === 'user') {
            $todayChats = \App\Models\ChatMessage::whereHas('session', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->where('role', 'user')->whereDate('created_at', now()->toDateString())->count();

            if ($todayChats >= 10) {
                return ApiResponse::error('Batas harian Chat AI (10x/hari) telah tercapai. Silakan coba lagi besok.', 429);
            }
        }

        try {
            $result = $this->chatService->sendMessage(
                $request->user()->id,
                $request->message,
                $request->session_id
            );

            return ApiResponse::success($result, 'Pesan terkirim');
        } catch (\Exception $e) {
            Log::error('Chat failed', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);
            return ApiResponse::error('Gagal mengirim pesan', code: 500);
        }
    }

    /**
     * Update feedback for a message.
     */
    public function feedback(Request $request): JsonResponse
    {
        $request->validate([
            'message_id' => 'required|integer',
            'is_helpful' => 'required|boolean',
            'note' => 'nullable|string',
        ]);

        $success = $this->chatService->updateFeedback(
            (int) $request->message_id,
            (bool) $request->is_helpful,
            $request->note
        );

        if ($success) {
            return ApiResponse::success(null, 'Feedback berhasil dikirim');
        }

        return ApiResponse::error('Gagal mengirim feedback');
    }

    /**
     * Delete a session.
     */
    public function delete(string $sessionId): JsonResponse
    {
        $success = $this->chatService->deleteSession($sessionId);
        
        if ($success) {
            return ApiResponse::success(null, 'Sesi berhasil dihapus');
        }

        return ApiResponse::error('Gagal menghapus sesi');
    }

    /**
     * Get unread messages count.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        return ApiResponse::success(['unread_count' => 0]);
    }
}
