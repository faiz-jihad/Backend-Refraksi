<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\RefractionResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    /**
     * Get recent activities for the user (Detections and Chats).
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $activities = [];

        // 1. Get last 5 Refraction Results
        $detections = RefractionResult::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        foreach ($detections as $d) {
            $ai = $d->ai_recommendations ?? [];
            $condition = $ai['predicted_class'] ?? $ai['condition_category'] ?? 'Normal';
            
            $activities[] = [
                'id' => 'det_' . $d->id,
                'type' => 'detection',
                'title' => 'Deteksi Mata: ' . $condition,
                'description' => 'Akurasi ' . (($ai['confidence'] ?? 1.0) * 100) . '% • ' . ($d->visual_acuity ?? '20/20'),
                'time' => $d->created_at->diffForHumans(),
                'timestamp' => $d->created_at->toISOString(),
            ];
        }

        // 2. Get last 5 Chat Sessions
        $chats = ChatSession::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();

        foreach ($chats as $c) {
            $activities[] = [
                'id' => 'chat_' . $c->id,
                'type' => 'chat',
                'title' => 'Konsultasi AI',
                'description' => $c->title ?? 'Sesi tanya jawab kesehatan mata',
                'time' => $c->updated_at->diffForHumans(),
                'timestamp' => $c->updated_at->toISOString(),
            ];
        }

        // Sort combined activities by timestamp
        usort($activities, function ($a, $b) {
            return strcmp($b['timestamp'], $a['timestamp']);
        });

        // Limit to top 10
        $activities = array_slice($activities, 0, 10);

        return ApiResponse::success(
            data: $activities,
            message: 'Aktivitas berhasil diambil'
        );
    }
}
