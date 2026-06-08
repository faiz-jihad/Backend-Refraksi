<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use Illuminate\Support\Facades\Artisan;

echo "Running migrations...\n";
try {
    $exitCode = Artisan::call('migrate', ['--force' => true]);
    echo "Exit Code: $exitCode\n";
    echo "Output: " . Artisan::output() . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
