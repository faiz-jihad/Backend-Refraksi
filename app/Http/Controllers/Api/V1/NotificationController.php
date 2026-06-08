<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $notifications = auth()->user()->notifications;
        
        // Map to structure expected by Flutter
        $data = $notifications->map(function ($n) {
            $notifData = is_array($n->data) ? $n->data : json_decode($n->data, true);
            return [
                'id' => $n->id,
                'title' => $notifData['title'] ?? 'Notifikasi',
                'content' => $notifData['message'] ?? '',
                'is_read' => $n->read_at ? 1 : 0,
                'read_at' => $n->read_at ? $n->read_at->toIso8601String() : null,
                'created_at' => $n->created_at->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    public function markAsRead(string $id): JsonResponse
    {
        $notification = auth()->user()->notifications()->where('id', $id)->first();
        
        if ($notification) {
            $notification->markAsRead();
            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Notification not found'
        ], 404);
    }
}
