<?php

use App\Http\Controllers\Web\AdminController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/run-migration-now', function() {
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    return "Migration completed: " . \Illuminate\Support\Facades\Artisan::output();
});

// Admin Web Routes
Route::prefix('admin')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });
    Route::get('/login', [AdminController::class, 'loginForm'])->name('login');
    Route::post('/login', [AdminController::class, 'login'])->name('admin.login.submit');
    Route::post('/logout', [AdminController::class, 'logout'])->name('admin.logout');

    Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        
        // API Documentation
        Route::get('/api-docs', function () {
            return view('admin.api-docs');
        })->name('admin.api-docs');
        
        // Admin User Guide
        Route::get('/guide', [AdminController::class, 'userGuide'])->name('admin.guide');
        
        // System & Backup
        Route::get('/system', [AdminController::class, 'systemIndex'])->name('admin.system');
        Route::post('/system/clear-cache', [AdminController::class, 'clearSystemCache'])->name('admin.system.clear-cache');
        
        Route::get('/backup', [AdminController::class, 'backupIndex'])->name('admin.backup');
        Route::get('/backup/download', [AdminController::class, 'downloadBackup'])->name('admin.backup.download');
        
        // Article management (Web)
        Route::get('/articles', function() {
            $articles = \App\Models\Article::latest()->get();
            return view('admin.articles.index', compact('articles'));
        })->name('admin.articles.index');

        Route::get('/articles/create', [AdminController::class, 'createArticle'])->name('admin.articles.create');
        Route::post('/articles', [AdminController::class, 'storeArticle'])->name('admin.articles.store');
        Route::get('/articles/{article}/edit', [AdminController::class, 'editArticle'])->name('admin.articles.edit');
        Route::put('/articles/{article}', [AdminController::class, 'updateArticle'])->name('admin.articles.update');
        Route::delete('/articles/{article}', [AdminController::class, 'destroyArticle'])->name('admin.articles.destroy');

        Route::get('/users', [AdminController::class, 'usersIndex'])->name('admin.users.index');
        Route::get('/users/export', [AdminController::class, 'exportUsers'])->name('admin.users.export');
        Route::get('/users/create', [AdminController::class, 'createUser'])->name('admin.users.create');
        Route::post('/users', [AdminController::class, 'storeUser'])->name('admin.users.store');
        
        Route::get('/chats', [AdminController::class, 'chatsIndex'])->name('admin.chats.index');
        Route::get('/chats/{session}', [AdminController::class, 'showChat'])->name('admin.chats.show');

        Route::get('/results', [AdminController::class, 'resultsIndex'])->name('admin.results.index');
        Route::get('/users/{user}/edit', [AdminController::class, 'editUser'])->name('admin.users.edit');
        Route::put('/users/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])->name('admin.users.destroy');
        Route::post('/users/{user}/toggle-role', [AdminController::class, 'toggleUserRole'])->name('admin.users.toggle-role');
        
        Route::get('/results/{result}', [AdminController::class, 'showResult'])->name('admin.results.show');
        
        Route::get('/hospitals', [AdminController::class, 'hospitalsIndex'])->name('admin.hospitals.index');
        Route::post('/hospitals', [AdminController::class, 'storeHospital'])->name('admin.hospitals.store');

        Route::get('/doctors', [AdminController::class, 'doctorsIndex'])->name('admin.doctors.index');
        Route::post('/doctors', [AdminController::class, 'storeDoctor'])->name('admin.doctors.store');
        Route::delete('/doctors/{doctor}', [AdminController::class, 'destroyDoctor'])->name('admin.doctors.destroy');
        
        // Admin Web Notifications
        Route::get('/notifications', [AdminController::class, 'getNotifications'])->name('admin.notifications.index');
        Route::post('/notifications/{id}/read', [AdminController::class, 'markNotificationRead'])->name('admin.notifications.read');
        Route::post('/notifications/read-all', [AdminController::class, 'markAllNotificationsRead'])->name('admin.notifications.read-all');
    });
});

// Production Ready Setup Route
Route::get('/setup/ready', function() {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        return "System is READY! Admin Account: admin@mataceria.com / admin123";
    } catch (\Exception $e) {
        return "Setup Error: " . $e->getMessage();
    }
});

// Direct APK download route linking to compiled Flutter APK
Route::get('/downloads/mataceria-latest.apk', function() {
    $path = 'd:/Portofolio Web/skin_detection_flutter/build/app/outputs/flutter-apk/app-release.apk';
    if (file_exists($path)) {
        return response()->download($path, 'mataceria-latest.apk', [
            'Content-Type' => 'application/vnd.android.package-archive',
        ]);
    }
    abort(404, 'File APK MataCeria belum dikompilasi. Jalankan kompilasi Flutter terlebih dahulu.');
})->name('download.apk');





