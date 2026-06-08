<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface HospitalRepositoryInterface
{
    public function getAll(int $perPage = 10): Collection;
    public function search(string $query): Collection;
    public function getNearby(float $lat, float $lng, float $radius = 10): Collection;
}
