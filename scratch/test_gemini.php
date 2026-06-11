<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\AI\GeminiService;

try {
    echo "Testing Gemini API...\n";
    $service = new GeminiService();
    $snellenData = [
        'smallest_row_read' => 100,
        'smallest_n_point' => 10,
        'astigmatism_found' => true,
        'duochrome_result' => 'red',
        'test_type' => 'comprehensive',
        'avg_distance_cm' => 40
    ];
    $response = $service->analyzeSnellen($snellenData);
    echo "Response:\n" . json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
