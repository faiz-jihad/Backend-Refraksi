<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use App\Models\RefractionResult;
use Illuminate\Pagination\LengthAwarePaginator;

interface RefractionRepositoryInterface
{
    public function create(array $data): RefractionResult;
    public function updateAiResult(int $id, array $aiResult): bool;
    public function findByUser(int $userId, int $perPage = 10): LengthAwarePaginator;
    public function findById(int $id): ?RefractionResult;
}
