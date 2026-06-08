<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\RefractionResult;
use App\Repositories\Contracts\RefractionRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class RefractionRepository implements RefractionRepositoryInterface
{
    public function __construct(
        private readonly RefractionResult $model
    ) {}

    public function create(array $data): RefractionResult
    {
        return $this->model->create($data);
    }

    public function updateAiResult(int $id, array $aiResult): bool
    {
        return $this->model->where('id', $id)
            ->update(['ai_recommendations' => $aiResult]);
    }

    public function findByUser(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model
            ->where('user_id', $userId)
            ->latest()
            ->paginate($perPage);
    }

    public function findById(int $id): ?RefractionResult
    {
        return $this->model->find($id);
    }
}
