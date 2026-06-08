<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $articles = \App\Models\Article::latest()->get();
    echo "Count: " . $articles->count() . "\n";
    $json = \App\Helpers\ApiResponse::success($articles)->getContent();
    echo "JSON Length: " . strlen($json) . "\n";
    echo "SUCCESS\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
