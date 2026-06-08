<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Hospital;
use App\Repositories\Contracts\HospitalRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class HospitalRepository implements HospitalRepositoryInterface
{
    public function getAll(int $perPage = 10): Collection
    {
        return Hospital::latest()->get();
    }

    public function search(string $query): Collection
    {
        return Hospital::where('name', 'like', "%{$query}%")
            ->orWhere('city', 'like', "%{$query}%")
            ->get();
    }

    public function getNearby(float $lat, float $lng, float $radius = 10): Collection
    {
        // Simple Haversine formula
        return Hospital::select('*')
            ->selectRaw(
                '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance',
                [$lat, $lng, $lat]
            )
            ->having('distance', '<=', $radius)
            ->orderBy('distance')
            ->get();
    }
}
