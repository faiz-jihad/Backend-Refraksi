<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Admin
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@mataceria.com'],
            [
                'name' => 'MataCeria Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // 2. Create Initial Articles
        $articles = [
            [
                'title' => 'Cara Menjaga Kesehatan Mata saat WFH',
                'content' => 'Gunakan aturan 20-20-20: setiap 20 menit, lihatlah sesuatu sejauh 20 kaki selama 20 detik untuk mengurangi kelelahan mata.',
                'category' => 'Tips',
                'image_url' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
            ],
            [
                'title' => 'Mengenal Rabun Jauh (Miopia)',
                'content' => 'Miopia adalah kondisi mata di mana objek jauh terlihat kabur, sementara objek dekat terlihat jelas. Hal ini biasanya terjadi karena bola mata terlalu panjang.',
                'category' => 'Edukasi',
                'image_url' => 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=1000',
            ],
            [
                'title' => 'Nutrisi Terbaik untuk Mata Anda',
                'content' => 'Wortel, bayam, dan ikan berminyak mengandung vitamin A dan Omega-3 yang sangat baik untuk kesehatan retina dan mencegah degenerasi makula.',
                'category' => 'Edukasi',
                'image_url' => 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1000',
            ],
        ];

        foreach ($articles as $article) {
            $article['slug'] = \Illuminate\Support\Str::slug($article['title']);
            \App\Models\Article::updateOrCreate(['title' => $article['title']], $article);
        }

        $this->call(ArticleSeeder::class);
        $this->call(DoctorSeeder::class);
    }
}
