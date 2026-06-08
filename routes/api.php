<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ChatController;
use App\Http\Controllers\Api\V1\HospitalController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\RefractionController;
use App\Http\Controllers\Api\V1\ActivityController;
use App\Http\Controllers\Api\V1\SettingController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Health Check
    Route::get('health/ml', function () {
        return response()->json(['status' => 'healthy', 'timestamp' => now()]);
    });

    // ⚠️  Setup routes — HANYA aktif di environment non-production
    if (!app()->isProduction()) {
        Route::get('setup/admin', function () {
            try {
                $admin = \App\Models\User::updateOrCreate(
                    ['email' => 'admin@mataceria.com'],
                    [
                        'name'     => 'Super Admin',
                        'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                        'role'     => 'admin',
                    ]
                );
                return response()->json([
                    'success' => true,
                    'message' => 'Admin user created/updated',
                    'user'    => $admin
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create admin: ' . $e->getMessage()
                ], 500);
            }
        });

        Route::get('setup/migrate', function () {
            try {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
                return response()->json([
                    'success' => true,
                    'message' => 'Migrations completed',
                    'output'  => \Illuminate\Support\Facades\Artisan::output()
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Migration failed: ' . $e->getMessage()
                ], 500);
            }
        });
    }

    // Public routes
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:auth');
    Route::post('login',    [AuthController::class, 'login'])->middleware('throttle:auth');
    Route::get('hospitals', [HospitalController::class, 'index']);
    Route::get('articles',  [ArticleController::class, 'index']);
    Route::get('articles/{id}', [ArticleController::class, 'show']);
    Route::get('settings', [SettingController::class, 'index']);
    Route::get('settings/{key}', [SettingController::class, 'show']);
Route::get('openapi', function () {
    return response()->json([
        'openapi' => '3.0.0',
        'info' => [
            'title' => 'MataCeria API',
            'version' => '1.0.0',
        ],
        'paths' => [],
    ]);
});

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout',  [AuthController::class, 'logout']);
        Route::get('profile',  [ProfileController::class, 'show']);
        Route::put('profile',  [ProfileController::class, 'update']);
        Route::post('profile/avatar', [ProfileController::class, 'updateAvatar']);
        Route::post('articles/{id}/like', [ArticleController::class, 'like']);

        Route::prefix('refraction')->group(function () {
            Route::post('analyze',    [RefractionController::class, 'analyze'])->middleware('throttle:ai');
            Route::get('predict',     [RefractionController::class, 'history']);
            Route::post('predict',    [RefractionController::class, 'predict'])->middleware('throttle:ai');
            Route::get('history',     [RefractionController::class, 'history']);
            Route::get('{id}',        [RefractionController::class, 'show'])->where('id', '[0-9]+');
        });

        Route::prefix('chat')->group(function () {
            Route::get('unread-count', [ChatController::class, 'unreadCount']);
            Route::get('sessions',    [ChatController::class, 'sessions']);
            Route::get('messages/{sessionId}', [ChatController::class, 'messages']);
            Route::post('send',       [ChatController::class, 'send'])->middleware('throttle:chat');
            Route::post('feedback',   [ChatController::class, 'feedback']);
            Route::delete('sessions/{sessionId}', [ChatController::class, 'delete']);
        });

        // Real Activities & Analytics
        Route::get('activities', [ActivityController::class, 'index']);
        
        // Notifications
        Route::get('notifications', [\App\Http\Controllers\Api\V1\NotificationController::class, 'index']);
        Route::put('notifications/{id}/read', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAsRead']);

        Route::prefix('analytics')->group(function () {
            Route::get('user', function() { return response()->json(['success' => true, 'data' => []]); });
            Route::get('categories', function() { return response()->json(['success' => true, 'data' => []]); });
            Route::get('frequent-queries', function() { return response()->json(['success' => true, 'data' => []]); });
        });

        Route::get('emergency-contacts', [HospitalController::class, 'index']); // Fallback
        Route::get('doctors', [\App\Http\Controllers\Api\V1\DoctorController::class, 'index']);
        
        // Admin routes
        Route::prefix('admin')->middleware('role:admin')->group(function () {
            // Get all users for export
            Route::get('users', [AdminController::class, 'users']);

            Route::prefix('articles')->group(function () {
                Route::post('/', [ArticleController::class, 'store']);
                Route::put('{id}', [ArticleController::class, 'update']);
                Route::delete('{id}', [ArticleController::class, 'destroy']);
            });
            
            Route::prefix('emergency-contacts')->group(function () {
                Route::post('/', [HospitalController::class, 'store']);
                Route::put('{id}', [HospitalController::class, 'update']);
                Route::delete('{id}', [HospitalController::class, 'destroy']);
            });

            Route::post('settings', [SettingController::class, 'update']);
        });
    });
});
