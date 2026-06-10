<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Services\AI\OpenRouterService;

try {
    echo "=== Menguji Analisis Snellen dengan OpenRouter Fallback ===\n";
    $service = new OpenRouterService();
    
    // Data tes simulasi silinder & rabun jauh
    $snellenData = [
        'smallest_row_read' => 100, // 20/100
        'smallest_n_point' => 10,
        'astigmatism_found' => true, // Ada indikasi silinder
        'duochrome_result' => 'red',
        'test_type' => 'comprehensive',
        'avg_distance_cm' => 40
    ];
    
    echo "Data Input Tes Snellen:\n" . json_encode($snellenData, JSON_PRETTY_PRINT) . "\n\n";
    
    $response = $service->analyzeSnellen($snellenData);
    
    echo "Hasil Analisis AI (JSON):\n" . json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
    echo "========================================================\n";
} catch (\Exception $e) {
    echo "Terjadi kesalahan: " . $e->getMessage() . "\n";
}
