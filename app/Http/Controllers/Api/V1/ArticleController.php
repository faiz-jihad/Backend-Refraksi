<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Repositories\Contracts\ArticleRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function __construct(
        private readonly ArticleRepositoryInterface $repository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');
        
        if ($category) {
            $articles = $this->repository->getByCategory($category);
        } else {
            $articles = $this->repository->getAll();
        }

        return ApiResponse::success($articles);
    }

    public function show(int $id): JsonResponse
    {
        $article = $this->repository->findById($id);
        
        if (!$article) {
            return ApiResponse::notFound('Artikel tidak ditemukan');
        }

        return ApiResponse::success($article);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'category' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $data['slug'] = Str::slug($data['title']) . '-' . time();

        $article = $this->repository->create($data);
        return ApiResponse::success($article, 'Artikel berhasil dibuat', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'title' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . time();
        }

        $article = $this->repository->update($id, $data);
        if (!$article) return ApiResponse::notFound('Artikel tidak ditemukan');
        
        return ApiResponse::success($article, 'Artikel berhasil diperbarui');
    }

    public function destroy(int $id): JsonResponse
    {
        $success = $this->repository->delete($id);
        if (!$success) return ApiResponse::notFound('Artikel tidak ditemukan');

        return ApiResponse::success(null, 'Artikel berhasil dihapus');
    }

    public function like(Request $request, int $id): JsonResponse
    {
        $userId = $request->user()->id;
        
        $exists = \Illuminate\Support\Facades\DB::table('article_likes')
            ->where('user_id', $userId)
            ->where('article_id', $id)
            ->exists();
            
        if ($exists) {
            \Illuminate\Support\Facades\DB::table('article_likes')
                ->where('user_id', $userId)
                ->where('article_id', $id)
                ->delete();
            $liked = false;
        } else {
            \Illuminate\Support\Facades\DB::table('article_likes')->insert([
                'user_id' => $userId,
                'article_id' => $id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $liked = true;
        }
        
        $likesCount = \Illuminate\Support\Facades\DB::table('article_likes')
            ->where('article_id', $id)
            ->count();
            
        return ApiResponse::success([
            'liked' => $liked,
            'likes_count' => $likesCount,
        ]);
    }
}
