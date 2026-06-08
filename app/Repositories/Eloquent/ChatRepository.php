<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Repositories\Contracts\ChatRepositoryInterface;
use Illuminate\Support\Collection;

class ChatRepository implements ChatRepositoryInterface
{
    public function getSessionsByUserId(int $userId): Collection
    {
        return ChatSession::where('user_id', $userId)
            ->withCount('messages')
            ->latest()
            ->get();
    }

    public function findBySessionId(string $sessionId): ?ChatSession
    {
        return ChatSession::where('session_id', $sessionId)->first();
    }

    public function createSession(array $data): ChatSession
    {
        return ChatSession::create($data);
    }

    public function saveMessage(array $data): void
    {
        ChatMessage::create($data);
    }

    public function getMessagesBySessionId(int $chatSessionId, int $perPage = 20): Collection
    {
        return ChatMessage::where('chat_session_id', $chatSessionId)
            ->oldest()
            ->get();
    }

    public function updateMessageFeedback(int $messageId, bool $isHelpful, ?string $note): bool
    {
        $message = ChatMessage::find($messageId);
        if ($message) {
            return $message->update([
                'is_helpful' => $isHelpful,
                'feedback_note' => $note,
            ]);
        }
        return false;
    }

    public function deleteSession(string $sessionId): bool
    {
        $session = $this->findBySessionId($sessionId);
        if ($session) {
            return (bool) $session->delete();
        }
        return false;
    }
}
