<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Repositories\Contracts\HospitalRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Hospital;

class HospitalController extends Controller
{
    public function __construct(
        private readonly HospitalRepositoryInterface $repository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = $request->query('search');
        
        if ($query) {
            $hospitals = $this->repository->search($query);
        } else {
            $hospitals = $this->repository->getAll();
        }

        return ApiResponse::success($hospitals);
    }

    public function nearby(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'radius' => 'nullable|numeric',
        ]);

        $hospitals = $this->repository->getNearby(
            (float) $request->lat,
            (float) $request->lng,
            (float) ($request->radius ?? 10)
        );

        return ApiResponse::success($hospitals);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'phone' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'city' => 'nullable|string',
        ]);

        $hospital = Hospital::create($validated);
        return ApiResponse::success($hospital, 'Kontak berhasil ditambahkan', 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'phone' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'city' => 'nullable|string',
        ]);

        $hospital = Hospital::findOrFail((int) $id);
        $hospital->update($validated);
        return ApiResponse::success($hospital, 'Kontak berhasil diperbarui');
    }

    public function destroy($id): JsonResponse
    {
        $hospital = Hospital::findOrFail((int) $id);
        $hospital->delete();
        return ApiResponse::success(null, 'Kontak berhasil dihapus');
    }
}
