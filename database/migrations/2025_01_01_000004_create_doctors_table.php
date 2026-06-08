<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $create) {
            $create->id();
            $create->string('name');
            $create->string('specialization')->default('Spesialis Mata (Oftalmologi)');
            $create->foreignId('hospital_id')->nullable()->constrained('hospitals')->nullOnDelete();
            $create->string('phone')->nullable();
            $create->string('schedule')->nullable();
            $create->string('image_url')->nullable();
            $create->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
