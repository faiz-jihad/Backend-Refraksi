<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\ChatSession;
use Illuminate\Support\Collection;

interface ChatRepositoryInterface
{
    public function getSessionsByUserId(int $userId): Collection;

    public function findBySessionId(string $sessionId): ?ChatSession;

    public function createSession(array $data): ChatSession;

    public function saveMessage(array $data): void;

    public function getMessagesBySessionId(int $chatSessionId, int $perPage = 20): Collection;

    public function updateMessageFeedback(int $messageId, bool $isHelpful, ?string $note): bool;

    public function deleteSession(string $sessionId): bool;
}
