<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_sessions', function (Blueprint $create) {
            $create->id();
            $create->foreignId('user_id')->constrained()->cascadeOnDelete();
            $create->string('session_id')->unique(); // For Flutter compatibility
            $create->string('title')->nullable();
            $create->timestamps();
        });

        Schema::create('chat_messages', function (Blueprint $create) {
            $create->id();
            $create->foreignId('chat_session_id')->constrained()->cascadeOnDelete();
            $create->enum('role', ['user', 'model', 'system']);
            $create->text('content');
            $create->string('message_type')->default('text'); // text, suggestion, etc
            $create->json('suggestions')->nullable();
            $create->boolean('is_helpful')->nullable();
            $create->text('feedback_note')->nullable();
            $create->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_sessions');
    }
};
