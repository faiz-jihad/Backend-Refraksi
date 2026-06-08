<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent;

use App\Models\Article;
use App\Repositories\Contracts\ArticleRepositoryInterface;
use Illuminate\Support\Collection;

class ArticleRepository implements ArticleRepositoryInterface
{
    public function getAll(int $perPage = 10): Collection
    {
        return Article::latest()->get();
    }

    public function findById(int $id)
    {
        return Article::find($id);
    }

    public function getByCategory(string $category): Collection
    {
        return Article::where('category', $category)->latest()->get();
    }

    public function create(array $data)
    {
        return Article::create($data);
    }

    public function update(int $id, array $data)
    {
        $article = Article::find($id);
        if ($article) {
            $article->update($data);
            return $article;
        }
        return null;
    }

    public function delete(int $id): bool
    {
        $article = Article::find($id);
        return $article ? (bool)$article->delete() : false;
    }
}
