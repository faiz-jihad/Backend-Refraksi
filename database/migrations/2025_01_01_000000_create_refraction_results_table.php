<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refraction_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('right_eye_sphere', 5, 2);
            $table->decimal('left_eye_sphere', 5, 2);
            $table->decimal('right_eye_cylinder', 5, 2)->nullable();
            $table->decimal('left_eye_cylinder', 5, 2)->nullable();
            $table->string('visual_acuity', 10);
            $table->json('ai_recommendations')->nullable();
            $table->timestamps();

            // Index untuk query umum
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refraction_results');
    }
};
