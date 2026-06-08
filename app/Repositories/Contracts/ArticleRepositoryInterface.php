<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface ArticleRepositoryInterface
{
    public function getAll(int $perPage = 10): Collection;
    public function findById(int $id);
    public function getByCategory(string $category): Collection;
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id): bool;
}
