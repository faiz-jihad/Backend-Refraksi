<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\AI\OpenRouterService;

try {
    echo "=== Menguji Chat dengan OpenRouter ===\n";
    $service = new OpenRouterService();
    
    $message = "Halo! Siapa namamu dan berikan 1 tips singkat menjaga kesehatan mata dari kelelahan layar.";
    echo "User: " . $message . "\n\n";
    
    $response = $service->chat($message);
    echo "AI:\n" . $response . "\n";
    echo "=====================================\n";
} catch (\Exception $e) {
    echo "Terjadi kesalahan: " . $e->getMessage() . "\n";
}
