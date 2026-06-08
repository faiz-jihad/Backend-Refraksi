<?php

// d:\backend-laravel-refraksi\backend-app\test_admin.php
// Manually testing the admin logic without a full HTTP request

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\User;
use App\Models\Article;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Repositories\Eloquent\ArticleRepository;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- WHITEBOX TEST: ADMIN FEATURES ---\n\n";

// 1. Check/Create Admin User
echo "[1] Checking Admin User...\n";
$admin = User::where('role', 'admin')->first();
if (!$admin) {
    echo "    Admin not found, creating one...\n";
    $admin = User::create([
        'name' => 'Test Admin',
        'email' => 'admin_test@example.com',
        'password' => Hash::make('password'),
        'role' => 'admin',
    ]);
}
echo "    Admin ID: {$admin->id}, Email: {$admin->email}, Role: {$admin->role}\n";

// 2. Test RoleMiddleware Logic
echo "\n[2] Testing RoleMiddleware Logic...\n";
$middleware = new \App\Http\Middleware\RoleMiddleware();

// 2.1 Test Admin User (Web)
$requestAdminWeb = Request::create('/admin/dashboard', 'GET');
$requestAdminWeb->setUserResolver(fn() => $admin);
$response = $middleware->handle($requestAdminWeb, function($req) {
    return response('Passed');
}, 'admin');

if ($response->getContent() === 'Passed') {
    echo "    SUCCESS: RoleMiddleware allowed admin access on Web.\n";
} else {
    echo "    FAILED: RoleMiddleware blocked admin access on Web.\n";
}

// 2.2 Test Non-Admin User (Web) -> Should throw 403 HttpException
$user = new User(['role' => 'user']);
$requestUserWeb = Request::create('/admin/dashboard', 'GET');
$requestUserWeb->setUserResolver(fn() => $user);

try {
    $middleware->handle($requestUserWeb, function($req) {
        return response('Passed');
    }, 'admin');
    echo "    FAILED: RoleMiddleware allowed non-admin access on Web.\n";
} catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
    if ($e->getStatusCode() === 403) {
        echo "    SUCCESS: RoleMiddleware correctly aborted non-admin web request with 403.\n";
    } else {
        echo "    FAILED: RoleMiddleware aborted non-admin web request with status " . $e->getStatusCode() . ".\n";
    }
} catch (\Exception $e) {
    echo "    FAILED: RoleMiddleware threw unexpected exception: " . $e->getMessage() . "\n";
}

// 2.3 Test Unauthenticated User (Web) -> Should redirect to login
$requestGuestWeb = Request::create('/admin/dashboard', 'GET');
$requestGuestWeb->setUserResolver(fn() => null);
$responseGuest = $middleware->handle($requestGuestWeb, function($req) {
    return response('Passed');
}, 'admin');

if ($responseGuest instanceof \Illuminate\Http\RedirectResponse) {
    echo "    SUCCESS: RoleMiddleware correctly redirected guest to login.\n";
} else {
    echo "    FAILED: RoleMiddleware did not redirect guest (Status: " . $responseGuest->getStatusCode() . ").\n";
}

// 2.4 Test Non-Admin User (API) -> Should return JSON response (403)
$requestUserApi = Request::create('/api/v1/admin/users', 'GET');
$requestUserApi->setUserResolver(fn() => $user);
$requestUserApi->headers->set('Accept', 'application/json');

$responseApi = $middleware->handle($requestUserApi, function($req) {
    return response('Passed');
}, 'admin');

if ($responseApi instanceof \Illuminate\Http\JsonResponse && $responseApi->getStatusCode() === 403) {
    echo "    SUCCESS: RoleMiddleware correctly blocked non-admin API request with 403 JSON.\n";
} else {
    echo "    FAILED: RoleMiddleware did not block non-admin API request correctly.\n";
}

// 3. Test ArticleController CRUD
echo "\n[3] Testing ArticleController CRUD...\n";
$repo = new ArticleRepository();
$controller = new ArticleController($repo);

// Test Store
echo "    -> Testing Store Article...\n";
$storeRequest = Request::create('/api/v1/admin/articles', 'POST', [
    'title' => 'Test Whitebox Article',
    'content' => 'This is a test content from whitebox testing.',
    'category' => 'Test',
]);

$storeResponse = $controller->store($storeRequest);
$articleData = $storeResponse->getData()->data;
$articleId = $articleData->id;

if ($storeResponse->getStatusCode() === 201) {
    echo "    SUCCESS: Article created (ID: $articleId).\n";
} else {
    echo "    FAILED: Could not create article.\n";
}

// Test Update
echo "    -> Testing Update Article...\n";
$updateRequest = Request::create("/api/v1/admin/articles/$articleId", 'PUT', [
    'title' => 'Updated Whitebox Article',
]);

$updateResponse = $controller->update($updateRequest, $articleId);
if ($updateResponse->getStatusCode() === 200) {
    echo "    SUCCESS: Article updated.\n";
} else {
    echo "    FAILED: Could not update article.\n";
}

// Test Delete
echo "    -> Testing Delete Article...\n";
$deleteResponse = $controller->destroy($articleId);
if ($deleteResponse->getStatusCode() === 200) {
    echo "    SUCCESS: Article deleted.\n";
} else {
    echo "    FAILED: Could not delete article.\n";
}

echo "\n--- TEST COMPLETED ---\n";
