<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use App\Models\ChatSession;
use App\Models\ChatMessage;

$sessions = ChatSession::withCount('messages')->get();
echo "Sessions Found: " . $sessions->count() . "\n";
foreach ($sessions as $s) {
    echo "Session ID: {$s->session_id}, Messages Count: {$s->messages_count}\n";
    if ($s->messages_count > 0) {
        $msg = $s->messages()->first();
        echo "Sample Message: Role: {$msg->role}, Content: " . substr($msg->message, 0, 30) . "...\n";
    }
}
